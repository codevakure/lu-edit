import React from "react";
import { ForwardedIconComponent } from "@/components/common/genericIconComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";

export function DashboardPlaceholder() {
  const navigate = useCustomNavigate();

  const quickActions = [
    {
      title: "Create New Flow",
      description: "Start building a new AI workflow",
      icon: "Plus",
      action: () => navigate("/flows"),
      variant: "default" as const,
    },
    {
      title: "Browse Templates",
      description: "Explore pre-built flow templates",
      icon: "FileText",
      action: () => navigate("/flows"),
      variant: "outline" as const,
    },
    {
      title: "View Components",
      description: "Browse available components",
      icon: "Package",
      action: () => navigate("/components"),
      variant: "outline" as const,
    },
    {
      title: "Check Logs",
      description: "Monitor system activity",
      icon: "ScrollText",
      action: () => navigate("/logs"),
      variant: "outline" as const,
    },
  ];

  const stats = [
    { label: "Total Flows", value: "12", icon: "Workflow" },
    { label: "Components", value: "45", icon: "Package" },
    { label: "Active Sessions", value: "3", icon: "Activity" },
    { label: "Recent Runs", value: "8", icon: "Play" },
  ];

  return (
    <div className="flex-1 p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Langflow. Manage your AI workflows and monitor system activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <ForwardedIconComponent
                name={stat.icon}
                className="h-4 w-4 text-muted-foreground"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card key={action.title} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="space-y-1">
                <div className="flex items-center space-x-2">
                  <ForwardedIconComponent
                    name={action.icon}
                    className="h-5 w-5"
                  />
                  <CardTitle className="text-base">{action.title}</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  {action.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant={action.variant}
                  size="sm"
                  onClick={action.action}
                  className="w-full"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity Feed</CardTitle>
            <CardDescription>
              Recent flows, runs, and system events will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ForwardedIconComponent
                name="Activity"
                className="h-12 w-12 text-muted-foreground mb-4"
              />
              <p className="text-muted-foreground">
                No recent activity to display
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Start creating flows to see activity here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
