import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bug, BugFormData, BugPriority } from '@/types/bug';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const bugFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  assignee: z.string().min(1, 'Assignee is required'),
  reporter: z.string().min(1, 'Reporter is required'),
  environment: z.string().min(1, 'Environment is required'),
  reproducible: z.boolean(),
  stepsToReproduce: z.string().optional(),
  tags: z.array(z.string()).default([])
});

interface BugFormProps {
  onSubmit: (data: BugFormData) => void;
  loading?: boolean;
  initialData?: Partial<Bug>;
  isEditing?: boolean;
}

export const BugForm: React.FC<BugFormProps> = ({
  onSubmit,
  loading = false,
  initialData,
  isEditing = false
}) => {
  const [tagInput, setTagInput] = React.useState('');

  const form = useForm<z.infer<typeof bugFormSchema>>({
    resolver: zodResolver(bugFormSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      priority: (initialData?.priority as BugPriority) ?? 'medium',
      assignee: initialData?.assignee ?? '',
      reporter: initialData?.reporter ?? '',
      environment: initialData?.environment ?? '',
      reproducible: initialData?.reproducible ?? false,
      stepsToReproduce: initialData?.stepsToReproduce ?? '',
      tags: initialData?.tags ?? []
    }
  });

  const handleSubmit = (data: z.infer<typeof bugFormSchema>) => {
    onSubmit(data as BugFormData);
  };

  const addTag = () => {
    if (tagInput.trim() && !form.getValues('tags').includes(tagInput.trim())) {
      const currentTags = form.getValues('tags');
      form.setValue('tags', [...currentTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  const priorityColors: Record<BugPriority, string> = {
    low: 'bg-info text-info-foreground',
    medium: 'bg-warning text-warning-foreground',
    high: 'bg-accent text-accent-foreground',
    critical: 'bg-critical text-critical-foreground'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Bug' : 'Report New Bug'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update the bug details below.' : 'Fill out the form below to report a new bug.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Bug Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a clear, descriptive title"
                        {...field}
                        data-testid="bug-title-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="priority-select">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">
                          <Badge variant="secondary" className={priorityColors.low}>Low</Badge>
                        </SelectItem>
                        <SelectItem value="medium">
                          <Badge variant="secondary" className={priorityColors.medium}>Medium</Badge>
                        </SelectItem>
                        <SelectItem value="high">
                          <Badge variant="secondary" className={priorityColors.high}>High</Badge>
                        </SelectItem>
                        <SelectItem value="critical">
                          <Badge variant="secondary" className={priorityColors.critical}>Critical</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="environment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Environment *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Chrome 120, iOS Safari"
                        {...field}
                        data-testid="environment-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter assignee name"
                        {...field}
                        data-testid="assignee-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reporter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reporter *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter reporter name"
                        {...field}
                        data-testid="reporter-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed description of the bug"
                      rows={4}
                      {...field}
                      data-testid="description-textarea"
                    />
                  </FormControl>
                  <FormDescription>
                    Include as much detail as possible to help developers understand the issue.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reproducible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="reproducible-checkbox"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>This bug is reproducible</FormLabel>
                    <FormDescription>
                      Check this if you can consistently reproduce the bug.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stepsToReproduce"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Steps to Reproduce</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="1. Navigate to...&#10;2. Click on...&#10;3. Observe..."
                      rows={3}
                      {...field}
                      data-testid="steps-textarea"
                    />
                  </FormControl>
                  <FormDescription>
                    List the exact steps needed to reproduce this bug.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags Section */}
            <div className="space-y-3">
              <FormLabel>Tags</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  data-testid="tag-input"
                />
                <Button type="button" onClick={addTag} variant="outline" data-testid="add-tag-button">
                  Add
                </Button>
              </div>
              {form.watch('tags').length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.watch('tags').map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                        data-testid={`remove-tag-${tag}`}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              data-testid="submit-button"
            >
              {loading ? 'Submitting...' : (isEditing ? 'Update Bug' : 'Report Bug')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};