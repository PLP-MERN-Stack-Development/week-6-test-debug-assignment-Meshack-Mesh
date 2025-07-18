import React from 'react';
import { Bug } from '@/types/bug';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Clock, Bug as BugIcon } from 'lucide-react';

interface BugStatsProps {
  bugs: Bug[];
}

export const BugStats: React.FC<BugStatsProps> = ({ bugs }) => {
  const stats = React.useMemo(() => {
    const total = bugs.length;
    const open = bugs.filter(bug => bug.status === 'open').length;
    const inProgress = bugs.filter(bug => bug.status === 'in-progress').length;
    const resolved = bugs.filter(bug => bug.status === 'resolved').length;
    const closed = bugs.filter(bug => bug.status === 'closed').length;
    
    const critical = bugs.filter(bug => bug.priority === 'critical').length;
    const high = bugs.filter(bug => bug.priority === 'high').length;
    const medium = bugs.filter(bug => bug.priority === 'medium').length;
    const low = bugs.filter(bug => bug.priority === 'low').length;

    const resolvedPercentage = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      critical,
      high,
      medium,
      low,
      resolvedPercentage
    };
  }, [bugs]);

  const statCards = [
    {
      title: 'Total Bugs',
      value: stats.total,
      description: 'All reported bugs',
      icon: BugIcon,
      color: 'text-foreground'
    },
    {
      title: 'Open',
      value: stats.open,
      description: 'Awaiting action',
      icon: AlertTriangle,
      color: 'text-primary'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      description: 'Being worked on',
      icon: Clock,
      color: 'text-accent'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      description: `${stats.resolvedPercentage}% completion rate`,
      icon: CheckCircle,
      color: 'text-secondary'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <CardDescription className="text-xs">{stat.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
      
      {/* Priority Breakdown */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Priority Breakdown</CardTitle>
          <CardDescription>Distribution of bugs by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-critical">{stats.critical}</div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{stats.high}</div>
              <div className="text-sm text-muted-foreground">High</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{stats.medium}</div>
              <div className="text-sm text-muted-foreground">Medium</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-info">{stats.low}</div>
              <div className="text-sm text-muted-foreground">Low</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};