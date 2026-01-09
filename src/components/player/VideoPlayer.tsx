import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
  Play, Pause, Volume2, VolumeX, Settings, Maximize, Minimize,
  SkipBack, SkipForward, Subtitles, Gauge, Languages, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  title: string;
  episodeTitle: string;
  episodeNumber: number;
  thumbnail?: string;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

const qualityOptions = [
  { value: '4k', label: '4K Ultra HD', badge: 'Best' },
  { value: '1080p', label: '1080p Full HD', badge: null },
  { value: '720p', label: '720p HD', badge: null },
  { value: '480p', label: '480p SD', badge: null },
  { value: '360p', label: '360p', badge: 'Data Saver' },
  { value: 'auto', label: 'Auto', badge: 'Recommended' },
];

const speedOptions = [
  { value: 0.25, label: '0.25x' },
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: 'Normal' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 1.75, label: '1.75x' },
  { value: 2, label: '2x' },
];

const audioOptions = [
  { value: 'japanese', label: 'Japanese (Original)' },
  { value: 'english', label: 'English Dub' },
  { value: 'hindi', label: 'Hindi Dub' },
  { value: 'tamil', label: 'Tamil Dub' },
];

const subtitleOptions = [
  { value: 'none', label: 'Off' },
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'arabic', label: 'Arabic' },
];

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  title,
  episodeTitle,
  episodeNumber,
  thumbnail,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(1440); // 24 minutes in seconds
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // Settings
  const [quality, setQuality] = useState('auto');
  const [speed, setSpeed] = useState(1);
  const [audio, setAudio] = useState('japanese');
  const [subtitle, setSubtitle] = useState('english');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout>();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    if (isPlaying) {
      controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const skip = (seconds: number) => {
    setCurrentTime(prev => Math.max(0, Math.min(duration, prev + seconds)));
  };

  const getCurrentQualityLabel = () => {
    return qualityOptions.find(q => q.value === quality)?.label || 'Auto';
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-black rounded-xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Placeholder / Thumbnail */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background/90 to-background/70">
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
          />
        )}
        <div className="relative z-10 text-center">
          <div 
            className="w-24 h-24 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto cursor-pointer hover:bg-primary/30 hover:scale-110 transition-all"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="w-12 h-12 text-primary" fill="currentColor" />
            ) : (
              <Play className="w-12 h-12 text-primary ml-1" fill="currentColor" />
            )}
          </div>
          <p className="text-lg font-semibold mb-1">{title}</p>
          <p className="text-muted-foreground">Episode {episodeNumber}: {episodeTitle}</p>
          <p className="text-xs text-muted-foreground mt-3 bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
            StreamTape/DoomStream Player Integration Ready
          </p>
        </div>
      </div>

      {/* Quality Badge */}
      <div className="absolute top-4 right-4 z-20">
        <span className="px-2 py-1 rounded text-xs font-semibold bg-primary text-primary-foreground">
          {quality === 'auto' ? '1080p' : quality.toUpperCase()}
        </span>
      </div>

      {/* Controls Overlay */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 p-4 pt-20",
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white/70 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Skip Back */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => skip(-10)}
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            {/* Previous Episode */}
            {hasPrev && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
                onClick={onPrev}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            )}

            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-10 w-10 sm:h-12 sm:w-12"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" />
              ) : (
                <Play className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" />
              )}
            </Button>

            {/* Next Episode */}
            {hasNext && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
                onClick={onNext}
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            )}

            {/* Skip Forward */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => skip(10)}
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-20 cursor-pointer"
              />
            </div>

            {/* Time Display */}
            <span className="text-white text-xs sm:text-sm ml-2 hidden sm:inline">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Speed Indicator */}
            {speed !== 1 && (
              <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded hidden sm:inline">
                {speed}x
              </span>
            )}

            {/* Settings Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* Quality */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Gauge className="w-4 h-4 mr-2" />
                    Quality
                    <span className="ml-auto text-xs text-muted-foreground">
                      {getCurrentQualityLabel()}
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={quality} onValueChange={setQuality}>
                      {qualityOptions.map((q) => (
                        <DropdownMenuRadioItem key={q.value} value={q.value}>
                          <span className="flex-1">{q.label}</span>
                          {q.badge && (
                            <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                              {q.badge}
                            </span>
                          )}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Speed */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Gauge className="w-4 h-4 mr-2" />
                    Playback Speed
                    <span className="ml-auto text-xs text-muted-foreground">
                      {speed === 1 ? 'Normal' : `${speed}x`}
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={speed.toString()} onValueChange={(v) => setSpeed(parseFloat(v))}>
                      {speedOptions.map((s) => (
                        <DropdownMenuRadioItem key={s.value} value={s.value.toString()}>
                          {s.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                {/* Audio Language */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Languages className="w-4 h-4 mr-2" />
                    Audio
                    <span className="ml-auto text-xs text-muted-foreground capitalize">
                      {audioOptions.find(a => a.value === audio)?.label.split(' ')[0]}
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={audio} onValueChange={setAudio}>
                      {audioOptions.map((a) => (
                        <DropdownMenuRadioItem key={a.value} value={a.value}>
                          {a.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Subtitles */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Subtitles className="w-4 h-4 mr-2" />
                    Subtitles
                    <span className="ml-auto text-xs text-muted-foreground capitalize">
                      {subtitleOptions.find(s => s.value === subtitle)?.label}
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={subtitle} onValueChange={setSubtitle}>
                      {subtitleOptions.map((s) => (
                        <DropdownMenuRadioItem key={s.value} value={s.value}>
                          {s.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Touch Controls for Mobile */}
      <div
        className="absolute inset-0 flex items-center justify-center sm:hidden"
        onClick={() => setShowControls(true)}
      >
        {showControls && (
          <div className="flex items-center gap-8">
            <button
              className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); skip(-10); }}
            >
              <SkipBack className="w-5 h-5 text-white" />
            </button>
            <button
              className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" fill="currentColor" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              )}
            </button>
            <button
              className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); skip(10); }}
            >
              <SkipForward className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
