import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  SkipBack, SkipForward, Subtitles, Gauge, Languages, ChevronLeft, ChevronRight,
  Crown, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';
import { getStreamUrl, getDownloadUrl, StreamSource, Subtitle, AudioTrack } from '@/services/anime';

interface VideoPlayerProps {
  title: string;
  episodeTitle: string;
  episodeNumber: number;
  animeId?: string;
  thumbnail?: string;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  // Stream data from backend
  streams?: StreamSource[];
  subtitles?: Subtitle[];
  audioTracks?: AudioTrack[];
  downloadUrl?: string;
}

const defaultQualityOptions = [
  { value: '1080p', label: '1080p Full HD', badge: 'Best' },
  { value: '720p', label: '720p HD', badge: null },
  { value: '480p', label: '480p SD', badge: null },
  { value: 'auto', label: 'Auto', badge: 'Recommended' },
];

const speedOptions = [
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: 'Normal' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 1.75, label: '1.75x' },
  { value: 2, label: '2x' },
];

const defaultAudioOptions = [
  { value: 'japanese', label: 'Japanese (Original)', default: true },
  { value: 'english', label: 'English Dub', default: false },
  { value: 'hindi', label: 'Hindi Dub', default: false },
  { value: 'tamil', label: 'Tamil Dub', default: false },
  { value: 'telugu', label: 'Telugu Dub', default: false },
];

const defaultSubtitleOptions = [
  { value: 'none', label: 'Off' },
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
];

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  title,
  episodeTitle,
  episodeNumber,
  animeId,
  thumbnail,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  streams = [],
  subtitles = [],
  audioTracks = [],
  downloadUrl,
}) => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(1440); // 24 minutes in seconds
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>('');
  
  // Settings
  const [quality, setQuality] = useState('auto');
  const [speed, setSpeed] = useState(1);
  const [audio, setAudio] = useState('japanese');
  const [subtitle, setSubtitle] = useState('english');
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout>();

  // Build quality options from streams or use defaults
  const qualityOptions = streams.length > 0 
    ? streams.map(s => ({ 
        value: s.quality, 
        label: s.quality === '1080p' ? '1080p Full HD' : s.quality === '720p' ? '720p HD' : `${s.quality} SD`,
        badge: s.quality === '1080p' ? 'Best' : null
      }))
    : defaultQualityOptions;

  // Build audio options from tracks or use defaults
  const audioOptions = audioTracks.length > 0
    ? audioTracks.map(a => ({ value: a.language, label: a.label, default: a.default }))
    : defaultAudioOptions;

  // Build subtitle options from data or use defaults
  const subtitleOptionsList = subtitles.length > 0
    ? [{ value: 'none', label: 'Off' }, ...subtitles.map(s => ({ value: s.language, label: s.label }))]
    : defaultSubtitleOptions;

  // Load stream URL when quality changes
  useEffect(() => {
    if (animeId && quality !== 'auto') {
      setIsLoading(true);
      getStreamUrl(animeId, episodeNumber, quality)
        .then(url => {
          setCurrentStreamUrl(url);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          // Use fallback stream from props if available
          const stream = streams.find(s => s.quality === quality);
          if (stream) setCurrentStreamUrl(stream.url);
        });
    }
  }, [animeId, episodeNumber, quality, streams]);

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
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100;
    }
  };

  const skip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleDownload = async () => {
    if (!profile.isPremium) {
      toast.error('Premium subscription required to download');
      navigate('/premium');
      return;
    }

    try {
      setIsLoading(true);
      let url = downloadUrl;
      
      if (!url && animeId) {
        url = await getDownloadUrl(animeId, episodeNumber, quality === 'auto' ? '720p' : quality);
      }
      
      if (url) {
        window.open(url, '_blank');
        toast.success('Download started!');
      } else {
        toast.error('Download not available for this episode');
      }
    } catch (error) {
      toast.error('Failed to get download link');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentQualityLabel = () => {
    const option = qualityOptions.find(q => q.value === quality);
    return option?.label || 'Auto';
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-black rounded-xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element (hidden when using StreamTape embed) */}
      {currentStreamUrl && (
        <iframe
          src={currentStreamUrl}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="autoplay; encrypted-media"
        />
      )}

      {/* Video Placeholder / Thumbnail (shown when no stream) */}
      {!currentStreamUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background/90 to-background/70">
          {thumbnail && (
            <img
              src={thumbnail}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
            />
          )}
          <div className="relative z-10 text-center">
            {isLoading ? (
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            ) : (
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
            )}
            <p className="text-lg font-semibold mb-1">{title}</p>
            <p className="text-muted-foreground">Episode {episodeNumber}: {episodeTitle}</p>
            <p className="text-xs text-muted-foreground mt-3 bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
              Click to load stream
            </p>
          </div>
        </div>
      )}

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

            {/* Download Button (Premium Only) */}
            {profile.isPremium && (
              <Button
                variant="ghost"
                size="icon"
                className="text-amber-400 hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
                onClick={handleDownload}
                disabled={isLoading}
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
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
                      {subtitlesEnabled ? subtitleOptionsList.find(s => s.value === subtitle)?.label : 'Off'}
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}>
                      <span className="flex-1">Subtitles</span>
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded",
                        subtitlesEnabled ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"
                      )}>
                        {subtitlesEnabled ? 'ON' : 'OFF'}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={subtitle} onValueChange={setSubtitle}>
                      {subtitleOptionsList.map((s) => (
                        <DropdownMenuRadioItem key={s.value} value={s.value} disabled={!subtitlesEnabled && s.value !== 'none'}>
                          {s.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                {/* Premium CTA */}
                {!profile.isPremium && (
                  <DropdownMenuItem 
                    onClick={() => navigate('/premium')}
                    className="cursor-pointer"
                  >
                    <Crown className="w-4 h-4 mr-2 text-amber-500" />
                    <span className="text-amber-500 font-medium">
                      Buy Premium for Better Experience
                    </span>
                  </DropdownMenuItem>
                )}

                {/* Download option in settings for premium */}
                {profile.isPremium && (
                  <DropdownMenuItem onClick={handleDownload} disabled={isLoading}>
                    <Download className="w-4 h-4 mr-2 text-amber-500" />
                    <span className="text-amber-500 font-medium">Download Episode</span>
                  </DropdownMenuItem>
                )}
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
