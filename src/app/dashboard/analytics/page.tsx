'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import { AiChat } from "@/components/dashboard/ai-chat"
import { redirect, useParams } from "next/navigation";

  export default function AnalyticsPage() {
    redirect('/dashboard');
  }
