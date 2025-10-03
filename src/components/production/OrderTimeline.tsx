import { TimelineEvent } from '@/types/productionOrder';
import { Clock, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface OrderTimelineProps {
  timeline: TimelineEvent[];
}

const getIcon = (type: string) => {
  switch (type) {
    case 'status_change':
      return CheckCircle2;
    case 'appointment':
      return Clock;
    case 'stop':
      return AlertCircle;
    case 'note':
      return MessageSquare;
    default:
      return Clock;
  }
};

export const OrderTimeline = ({ timeline }: OrderTimelineProps) => {
  if (timeline.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhum evento registrado ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timeline.map((event, index) => {
        const Icon = getIcon(event.type);
        const isLast = index === timeline.length - 1;

        return (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-2">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              {!isLast && <div className="w-0.5 flex-1 bg-border mt-2" />}
            </div>

            <div className="flex-1 pb-6">
              <div className="flex items-center justify-between">
                <p className="font-medium">{event.description}</p>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(event.timestamp), 'dd/MM/yyyy HH:mm')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Por {event.user}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
