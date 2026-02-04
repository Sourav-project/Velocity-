'use client';

import React from "react"

import { useState, useRef } from 'react';
import { Upload, User, Mail, Calendar, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState('/api/placeholder?w=200&h=200');
  const [userName, setUserName] = useState('Digital Hero');
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    console.log('Saving profile:', { userName, userEmail });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-animated py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Profile Card */}
        <div className="card-constant-glow rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-accent/50 rounded-2xl blur-2xl glow-accent"></div>
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt={userName}
                  className="relative w-48 h-48 rounded-2xl object-cover border-2 border-accent/50 animate-pulse-glow"
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-primary rounded-lg text-white hover:shadow-lg transition-all duration-300 glow-accent"
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Profile Info Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold gradient-text animate-text-glow mb-2">
                  {userName}
                </h1>
                <p className="text-secondary text-lg">Your AURA Journey</p>
              </div>

              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-foreground/70">
                    <Mail className="w-5 h-5 text-secondary" />
                    <span>{userEmail}</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/70">
                    <Calendar className="w-5 h-5 text-secondary" />
                    <span>Member since Feb 2024</span>
                  </div>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-accent to-primary text-white hover:shadow-lg transition-all duration-300 glow-accent"
                  >
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-primary text-primary-foreground hover:shadow-lg transition-all duration-300"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="border-border/50 text-foreground hover:bg-card/50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-constant-glow rounded-xl p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-400">850</p>
            <p className="text-sm text-foreground/50 mt-1">Credits Earned</p>
          </div>

          <div className="card-constant-glow rounded-xl p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-orange-400">600</p>
            <p className="text-sm text-foreground/50 mt-1">Credits Spent</p>
          </div>

          <div className="card-constant-glow rounded-xl p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-400">45</p>
            <p className="text-sm text-foreground/50 mt-1">Study Streak</p>
          </div>

          <div className="card-constant-glow rounded-xl p-6 text-center animate-pulse-glow">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent" />
              </div>
            </div>
            <p className="text-2xl font-bold text-accent">92%</p>
            <p className="text-sm text-foreground/50 mt-1">Consistency</p>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="card-constant-glow rounded-2xl p-8">
          <h2 className="text-2xl font-bold gradient-text mb-6">Recent Achievements</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {['First Task Completed', 'Week Streak', 'Perfect Day'].map((achievement, idx) => (
              <div
                key={idx}
                className="bg-background/50 rounded-lg p-4 border border-border/50 text-center hover:border-accent/50 transition-colors"
              >
                <p className="font-semibold text-foreground">{achievement}</p>
                <p className="text-xs text-foreground/50 mt-1">Unlocked recently</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
