import React, { useMemo, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import TranscriptViewer from './TranscriptViewer';

type Segment = {
  id: string;
  speaker: 'docente' | 'estudiante';
  speakerLabel: string;
  start: number;
  end: number;
  text: string;
  relevant: boolean;
  confidence: number;
  topics: string[];
};

type Props = {
  duration: number;
  segments: Segment[];
};

export default function SessionExperience({ duration, segments }: Props) {
  const [time, setTime] = useState(0);

  const sorted = useMemo(() => [...segments].sort((a, b) => a.start - b.start), [segments]);

  return (
    <div>
      <VideoPlayer duration={Math.max(1, Math.round(duration))} currentTime={time} onTimeChange={setTime} />
      <TranscriptViewer segments={sorted} currentTime={time} onSeek={setTime} />
    </div>
  );
}
