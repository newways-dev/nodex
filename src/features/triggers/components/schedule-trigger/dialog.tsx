"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useMemo, useState } from "react";
import { computeNextRun, formatScheduleSummary, type ScheduleConfig } from "./schedule";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ScheduleConfig) => void;
  defaultValues?: Partial<ScheduleConfig>;
}

const WEEKDAYS = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
];

export const ScheduleTriggerDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const [frequency, setFrequency] = useState<ScheduleConfig["frequency"]>(
    defaultValues.frequency ?? "interval",
  );
  const [intervalValue, setIntervalValue] = useState(
    defaultValues.intervalValue ?? 15,
  );
  const [intervalUnit, setIntervalUnit] = useState<"minutes" | "hours">(
    defaultValues.intervalUnit ?? "minutes",
  );
  const [timeOfDay, setTimeOfDay] = useState(defaultValues.timeOfDay ?? "09:00");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(
    defaultValues.daysOfWeek?.length ? defaultValues.daysOfWeek : [1],
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    setFrequency(defaultValues.frequency ?? "interval");
    setIntervalValue(defaultValues.intervalValue ?? 15);
    setIntervalUnit(defaultValues.intervalUnit ?? "minutes");
    setTimeOfDay(defaultValues.timeOfDay ?? "09:00");
    setDaysOfWeek(
      defaultValues.daysOfWeek?.length ? defaultValues.daysOfWeek : [1],
    );
  }, [open, defaultValues]);

  const config: ScheduleConfig = useMemo(
    () => ({
      frequency,
      intervalValue,
      intervalUnit,
      timeOfDay,
      daysOfWeek,
    }),
    [frequency, intervalValue, intervalUnit, timeOfDay, daysOfWeek],
  );

  const summary = useMemo(() => formatScheduleSummary(config), [config]);
  const nextRun = useMemo(() => computeNextRun(config, new Date()), [config]);

  const toggleDay = (day: number) => {
    setDaysOfWeek((current) =>
      current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day].sort((a, b) => a - b),
    );
  };

  const handleSubmit = () => {
    onSubmit(config);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Configuration</DialogTitle>
          <DialogDescription>
            Choose how often this workflow should run automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <RadioGroup
            value={frequency}
            onValueChange={(value) =>
              setFrequency(value as ScheduleConfig["frequency"])
            }
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="interval" id="frequency-interval" />
              <Label htmlFor="frequency-interval">Every X minutes/hours</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="daily" id="frequency-daily" />
              <Label htmlFor="frequency-daily">Daily at a set time</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="weekly" id="frequency-weekly" />
              <Label htmlFor="frequency-weekly">On specific weekdays</Label>
            </div>
          </RadioGroup>

          {frequency === "interval" && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                value={intervalValue}
                onChange={(e) => setIntervalValue(Number(e.target.value))}
                className="w-24"
              />
              <ToggleGroup
                type="single"
                variant="outline"
                value={intervalUnit}
                onValueChange={(value) =>
                  value && setIntervalUnit(value as "minutes" | "hours")
                }
              >
                <ToggleGroupItem value="minutes">Minutes</ToggleGroupItem>
                <ToggleGroupItem value="hours">Hours</ToggleGroupItem>
              </ToggleGroup>
            </div>
          )}

          {(frequency === "daily" || frequency === "weekly") && (
            <div className="space-y-2">
              <Label htmlFor="time-of-day">Time (UTC)</Label>
              <Input
                id="time-of-day"
                type="time"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                className="w-32"
              />
            </div>
          )}

          {frequency === "weekly" && (
            <div className="space-y-2">
              <Label>Days</Label>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((day) => (
                  <Button
                    key={day.value}
                    type="button"
                    size="sm"
                    variant={
                      daysOfWeek.includes(day.value) ? "default" : "outline"
                    }
                    onClick={() => toggleDay(day.value)}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg bg-muted p-4 space-y-1">
            <p className="text-sm font-medium">{summary}</p>
            <p className="text-xs text-muted-foreground">
              Next run: {nextRun.toUTCString()}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
