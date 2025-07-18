import React from 'react';
import { Bug, BugStatus, BugPriority } from '@/types/bug';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar, User, Tag, Monitor, Edit, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface BugCardProps {
  bug: Bug;
  onStatusChange: (id: string, status: BugStatus) => void;
  onEdit: (bug: Bug) => void;
  onDelete: (id: string) => void;
}

export const BugCard: React.FC<BugCardProps> = ({ bug, onStatusChange, onEdit, onDelete }) => {
  const statusColors: Record<BugStatus, string> = {
    open: 'bg-primary text-primary-foreground',
    'in-progress': 'bg-accent text-accent-foreground',
    resolved: 'bg-secondary text-secondary-foreground',
    closed: 'bg-muted text-muted-foreground'
  };

  const priorityColors: Record<BugPriority, string> = {
    low: 'bg-info text-info-foreground',
    medium: 'bg-warning text-warning-foreground',
    high: 'bg-accent text-accent-foreground',
    critical: 'bg-critical text-critical-foreground'
  };

  const getCardShadow = () => {
    switch (bug.priority) {
      case 'critical':
        return 'shadow-critical';
      case 'high':
        return 'shadow-bug';
      default:
        return '';
    }
  };

  return (
    <Card className={`${getCardShadow()} transition-all hover:shadow-lg`} data-testid={`bug-card-${bug.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-lg leading-6">{bug.title}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className={statusColors[bug.status]}>
                {bug.status.replace('-', ' ')}
              </Badge>
              <Badge variant="secondary" className={priorityColors[bug.priority]}>
                {bug.priority}
              </Badge>
              {bug.reproducible && (
                <Badge variant="outline">Reproducible</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(bug)}
              data-testid={`edit-bug-${bug.id}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  data-testid={`delete-bug-${bug.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Bug</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{bug.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(bug.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-sm leading-relaxed">
          {bug.description}
        </CardDescription>

        {/* Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Assignee: {bug.assignee}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Reporter: {bug.reporter}</span>
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>Environment: {bug.environment}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Updated: {formatDistanceToNow(bug.updatedAt, { addSuffix: true })}</span>
          </div>
        </div>

        {/* Tags */}
        {bug.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {bug.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Steps to Reproduce */}
        {bug.stepsToReproduce && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Steps to Reproduce:</h4>
            <pre className="text-sm text-muted-foreground bg-muted p-3 rounded-md whitespace-pre-wrap">
              {bug.stepsToReproduce}
            </pre>
          </div>
        )}

        {/* Status Change */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Created: {formatDistanceToNow(bug.createdAt, { addSuffix: true })}
            </span>
          </div>
          <Select
            value={bug.status}
            onValueChange={(value: BugStatus) => onStatusChange(bug.id, value)}
          >
            <SelectTrigger className="w-32" data-testid={`status-select-${bug.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};