import * as React from 'react'

import type { LocalJSXCommandOnDone } from '../../types/command.js'
import { getGlobalConfig, saveGlobalConfig } from '../../utils/config.js'
import {
  companionUserId,
  getCompanion,
  roll,
} from '../../buddy/companion.js'
import { renderSprite } from '../../buddy/sprites.js'
import { RARITY_STARS } from '../../buddy/types.js'

export async function call(
  onDone: LocalJSXCommandOnDone,
): Promise<React.ReactNode> {
  const config = getGlobalConfig()
  const companion = getCompanion()

  if (companion) {
    const sprite = renderSprite(companion)
    const stars = RARITY_STARS[companion.rarity]
    onDone(
      [
        '',
        ...sprite,
        '',
        `  ${companion.name} (${companion.species}) ${stars}`,
        `  ${companion.personality}`,
        '',
      ].join('\n'),
    )
    return null
  }

  // First time — hatch a companion
  const { bones, inspirationSeed } = roll(companionUserId())
  const speciesName = bones.species.charAt(0).toUpperCase() + bones.species.slice(1)
  const name = `${speciesName}-${(inspirationSeed % 1000).toString().padStart(3, '0')}`
  const stored = {
    name,
    personality: 'A curious companion who watches you code.',
    hatchedAt: Date.now(),
  }
  saveGlobalConfig({ ...config, companion: stored })
  const sprite = renderSprite({ ...stored, ...bones })
  const stars = RARITY_STARS[bones.rarity]
  onDone(
    [
      '',
      '  An egg hatches...!',
      '',
      ...sprite,
      '',
      `  ${name} (${bones.species}) ${stars}`,
      `  A curious companion who watches you code.`,
      '',
    ].join('\n'),
  )
  return null
}
