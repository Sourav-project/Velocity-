import { streamText, convertToModelMessages } from 'ai';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function getSessionUserId(request: Request): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  const userId = cookieStore.get('user_id')?.value;

  if (!sessionToken || !userId) {
    return null;
  }

  return userId;
}

const NOVA_SYSTEM_PROMPT = `You are Nova, an intelligent AI study assistant for the Velocity adaptive study planner. Your role is to:

1. **Provide Personalized Guidance**: Analyze student tasks, deadlines, and energy patterns to give tailored study recommendations
2. **Combat Planner Guilt**: Reassure students that falling behind is normal and help them develop catch-up strategies
3. **Optimize Study Sessions**: Suggest when to study high-intensity vs. low-intensity tasks based on their peak energy hours
4. **Support Spaced Repetition**: Remind students about review sessions and explain the science behind spaced repetition
5. **Motivate & Encourage**: Be supportive and positive while being realistic about workload

When users ask about:
- **Tasks**: Analyze priority using the formula P = (D × C) / T where D=difficulty, C=importance, T=time remaining
- **Schedule**: Consider their peak hours and energy slumps
- **Overdue work**: Offer concrete redistribution strategies without guilt-shaming
- **Retention**: Recommend spaced repetition intervals
- **Study methods**: Suggest Pomodoro technique, active recall, and interleaved practice

Always be encouraging, practical, and evidence-based. Help students see that the system adapts TO THEM, not the other way around.`;

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId(request);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { messages, studyPeriodId } = await request.json();

    // Fetch user context for better responses
    let userContext = '';
    if (studyPeriodId) {
      try {
        const tasksResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/tasks?study_period_id=eq.${studyPeriodId}&user_id=eq.${userId}&limit=5&order=due_date.asc`,
          {
            headers: {
              apikey: SUPABASE_SERVICE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            },
          }
        );

        if (tasksResponse.ok) {
          const tasks = await tasksResponse.json();
          if (tasks.length > 0) {
            userContext = `\n\nCurrent user context:\n- Has ${tasks.length} upcoming tasks\n- Next deadline: ${tasks[0]?.due_date || 'unknown'}`;
          }
        }
      } catch {
        // Continue without context if fetch fails
      }
    }

    // Convert messages to model format
    const modelMessages = await convertToModelMessages(messages);

    // Call AI SDK with streaming
    const result = streamText({
      model: 'openai/gpt-4o-mini',
      system: NOVA_SYSTEM_PROMPT + userContext,
      messages: modelMessages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Save chat to history
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const userMessage = lastMessage.parts?.find((p: any) => typeof p.text === 'string')?.text || lastMessage.content;

      try {
        await fetch(`${SUPABASE_URL}/rest/v1/chat_history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          },
          body: JSON.stringify({
            user_id: userId,
            study_period_id: studyPeriodId,
            role: 'user',
            message: userMessage,
          }),
        });
      } catch {
        // Continue even if history save fails
      }
    }

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('[v0] Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
