"use client";

import { Construction, Clock } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[400px] text-center space-y-4">
      <div className="relative">
        <Construction className="h-24 w-24 text-muted-foreground/50" />
        <Clock className="h-8 w-8 text-muted-foreground absolute -top-2 -right-2 bg-background rounded-full p-1" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground max-w-md">
          {description ||
            "This page is currently under development. Check back soon for updates!"}
        </p>
      </div>

      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Coming Soon</span>
      </div>
    </div>
  );
}
