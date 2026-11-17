import { useState } from 'react';
import type { BackdropKind, GalleryPost } from '../../types';
import { ColosseumScene } from './ColosseumScene';
import { TrainingScene } from './TrainingScene';
import { CampScene } from './CampScene';
import { ArchBackdrop, BustBackdrop, LegionBackdrop, RoadBackdrop, TempleBackdrop } from './GalleryBackdrops';

const TINTS: Record<GalleryPost['tint'], string> = {
  ember: 'linear-gradient(180deg, rgba(60,24,10,0.1), rgba(40,16,8,0.35))',
  dusk: 'linear-gradient(180deg, rgba(20,26,40,0.25), rgba(20,18,20,0.3))',
  stone: 'linear-gradient(180deg, rgba(20,18,16,0.15), rgba(20,18,16,0.35))',
  wine: 'linear-gradient(180deg, rgba(70,24,28,0.25), rgba(40,14,16,0.4))',
  olive: 'linear-gradient(180deg, rgba(40,40,20,0.15), rgba(30,28,16,0.35))',
};

interface Props {
  kind: BackdropKind;
  tint?: GalleryPost['tint'];
  photo?: string;
  animate?: boolean;
}

/**
 * Painted cinematic backdrop. If a photograph is configured it is layered on top,
 * and silently removed if it fails to load — the painted scene is always the fallback.
 */
export function SceneBackdrop({ kind, tint = 'stone', photo, animate = false }: Props) {
  const [photoOk, setPhotoOk] = useState(true);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {kind === 'colosseum' && <ColosseumScene animate={animate} />}
      {kind === 'courtyard' && <TrainingScene animate={animate} />}
      {kind === 'camp' && <CampScene animate={animate} />}
      {kind === 'temple' && <TempleBackdrop />}
      {kind === 'bust' && <BustBackdrop />}
      {kind === 'road' && <RoadBackdrop />}
      {kind === 'legion' && <LegionBackdrop />}
      {kind === 'arch' && <ArchBackdrop />}
      {photo && photoOk && (
        <img
          src={photo}
          alt=""
          loading="lazy"
          onError={() => setPhotoOk(false)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: 'sepia(0.25) saturate(0.8) contrast(1.05) brightness(0.8)' }}
        />
      )}
      <div className="absolute inset-0" style={{ background: TINTS[tint] }} />
    </div>
  );
}
