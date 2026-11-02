import {
  Activity, ArrowLeft, ArrowRight, Award, BookOpen, Box, Brain, Car, Check, ChevronLeft, CircleDot, CircleHelp, Coins, Crown,
  Download, Ear, Eye, FlaskConical, Flame, Footprints, Hand, Heart, House, Info, Layers, Lightbulb, Lock, MapPin, MessageCircle, Monitor,
  Orbit, PenTool, Play, Puzzle, Rocket, RotateCcw, Ruler, Scale, Settings, Shapes, Share2, ShieldCheck, Sigma, Sparkles,
  Star, Swords, Target, Telescope, Trophy, Vibrate, Volume2, VolumeX, Wind, X, Zap,
} from 'lucide-react'

const map = {
  Activity, ArrowLeft, ArrowRight, Award, BookOpen, Box, Brain, Car, Check, ChevronLeft, CircleDot, HelpCircle: CircleHelp,
  Coins, Crown, Download, Ear, Eye, FlaskConical, Flame, Footprints, Hand, Heart, House, Info, Layers, Lightbulb, Lock, MapPin, MessageCircle, Monitor,
  Orbit, PenTool, Play, Puzzle, Rocket, RotateCcw, Ruler, Scale, Settings, Shapes, Share2, ShieldCheck, Sigma, Sparkles,
  Star, Swords, Target, Telescope, Trophy, Vibrate, Volume2, VolumeX, Wind, X, Zap,
}

export default function Icon({ name, size = 22, ...rest }) {
  const C = map[name] || Sparkles
  return <C size={size} strokeWidth={2.2} aria-hidden {...rest} />
}
