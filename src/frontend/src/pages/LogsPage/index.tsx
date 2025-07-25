import React, { useState } from "react";
import { ForwardedIconComponent } from "@/components/common/genericIconComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LogsPlaceholder() {
  const [searchQuery, setSearchQuery] = useState("");
  const [logLevel, setLogLevel] = useState("all");

  // Mock log data - in a real implementation, this would come from an API
  const mockLogs = [
    {
      id: "1",
      timestamp: "2024-01-15 10:30:15",
      level: "info",
      source: "Flow Engine",
      message: "Flow 'Customer Support Bot' executed successfully",
      duration: "2.3s",
    },
    {
      id: "2",
      timestamp: "2024-01-15 10:28:42",
      level: "warning",
      source: "Component Loader",
      message: "Component 'CustomAPI' took longer than expected to load",
      duration: "5.1s",
    },
    {
      id: "3",
      timestamp: "2024-01-15 10:25:18",
      level: "error",
      source: "Authentication",
      message: "Failed to authenticate API request - invalid token",
      duration: "-",
    },
    {
      id: "4",
      timestamp: "2024-01-15 10:22:05",
      level: "info",
      source: "System",
      message: "Langflow started successfully on port 7860",
      duration: "-",
    },
  ];

  const logLevelColors = {
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    debug: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };

  const logLevelIcons = {
    info: "Info",
    warning: "AlertTriangle",
    error: "AlertCircle",
    debug: "Settings",
  };

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = logLevel === "all" || log.level === logLevel;
    return matchesSearch && matchesLevel;
  });

  const stats = [
    { label: "Total Logs", value: "1,247", icon: "FileText", change: "+12%" },
    { label: "Errors", value: "3", icon: "AlertCircle", change: "-25%" },
    { label: "Warnings", value: "8", icon: "AlertTriangle", change: "+5%" },
    { label: "System Health", value: "98%", icon: "Heart", change: "+1%" },
  ];

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
        <p className="text-muted-foreground">
          Monitor system activity, errors, and performance metrics
        </p>
      </div>

      {/* Stats Overview */}
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
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : ''}>
                  {stat.change}
                </span>{' '}
                from last hour
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={logLevel} onValueChange={setLogLevel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Log Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="debug">Debug</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="whitespace-nowrap">
          <ForwardedIconComponent name="Download" className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
          <CardDescription>
            System events and application logs from the last 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <ForwardedIconComponent
                      name={logLevelIcons[log.level]}
                      className="h-5 w-5 mt-0.5"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={`text-xs ${logLevelColors[log.level]}`}
                        variant="secondary"
                      >
                        {log.level.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {log.source}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {log.timestamp}
                      </span>
                      {log.duration !== "-" && (
                        <span className="text-sm text-muted-foreground">
                          {log.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-sm">{log.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ForwardedIconComponent
                  name="Search"
                  className="h-12 w-12 text-muted-foreground mb-4"
                />
                <h3 className="text-lg font-medium">No logs found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or log level filter
                </p>
              </div>
            )}
          </div>
          
          {filteredLogs.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {filteredLogs.length} of {mockLogs.length} logs
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  <ForwardedIconComponent name="ChevronLeft" className="h-4 w-4" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                  <ForwardedIconComponent name="ChevronRight" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
