'use client';

import React from "react"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studyPeriodId: string;
  onTaskCreated?: () => void;
}

export function CreateTaskModal({
  open,
  onOpenChange,
  studyPeriodId,
  onTaskCreated,
}: CreateTaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    difficulty: '5',
    importance: '5',
    estimatedTime: '45',
    dueDate: '',
    intensity: 'medium',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studyPeriodId,
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          difficulty: parseInt(formData.difficulty),
          importance: parseInt(formData.importance),
          estimatedTime: parseInt(formData.estimatedTime),
          dueDate: formData.dueDate,
          intensity: formData.intensity,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create task');
      }

      setFormData({
        title: '',
        description: '',
        subject: '',
        difficulty: '5',
        importance: '5',
        estimatedTime: '45',
        dueDate: '',
        intensity: 'medium',
      });

      onTaskCreated?.();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Complete Chapter 5 Review"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add any notes or details about this task..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject/Topic</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="e.g., Biology"
                value={formData.subject}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty (1-10)</Label>
              <Input
                id="difficulty"
                name="difficulty"
                type="number"
                min="1"
                max="10"
                value={formData.difficulty}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="importance">Importance (1-10)</Label>
              <Input
                id="importance"
                name="importance"
                type="number"
                min="1"
                max="10"
                value={formData.importance}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time (min)</Label>
              <Input
                id="estimatedTime"
                name="estimatedTime"
                type="number"
                min="15"
                value={formData.estimatedTime}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="intensity">Intensity Level</Label>
            <Select value={formData.intensity} onValueChange={(value) => handleSelectChange('intensity', value)}>
              <SelectTrigger id="intensity" disabled={loading}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
