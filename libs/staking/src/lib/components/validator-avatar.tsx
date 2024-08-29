'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import store from 'store2';
import { ValidatorIcon } from '@haqq/shell-ui-kit/server';

const avatarsCacheKey = 'validator_avatars';

export function ValidatorAvatar({ identity }: { identity?: string }) {
  const [avatarsCache, setAvatarsCache] = useState<Record<string, string>>(
    store.get(avatarsCacheKey) ?? {},
  );
  const getAvatarFromKeybase = useCallback(async (identity: string) => {
    try {
      const response = await fetch(
        `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Error fetching avatar from Keybase:', error);
      return undefined;
    }
  }, []);

  useEffect(() => {
    store.set(avatarsCacheKey, avatarsCache);
  }, [avatarsCache]);

  useEffect(() => {
    (async () => {
      if (identity && !avatarsCache[identity]) {
        const keyBaseData = await getAvatarFromKeybase(identity);
        if (keyBaseData?.them?.[0]?.pictures?.primary?.url) {
          const uri = String(keyBaseData.them[0].pictures.primary.url).replace(
            'https://s3.amazonaws.com/keybase_processed_uploads/',
            '',
          );

          if (uri) {
            setAvatarsCache((prev) => {
              return {
                ...prev,
                [identity]: uri,
              };
            });
          }
        }
      }
    })();
  }, [identity, getAvatarFromKeybase, avatarsCache]);

  const logo = useMemo(() => {
    if (identity) {
      const url = avatarsCache[identity];

      if (!url) {
        return undefined;
      }

      return url.startsWith('http')
        ? url
        : `https://s3.amazonaws.com/keybase_processed_uploads/${url}`;
    }

    return undefined;
  }, [identity, avatarsCache]);

  return (
    <div className="relative flex h-[38px] w-[38px] flex-row items-center justify-center overflow-hidden rounded-[8px] bg-[#FFFFFF3D] text-[#AAABB2]">
      {logo && (
        <Image
          src={logo}
          alt=""
          className="object-cover"
          width={360}
          height={360}
        />
      )}
      <ValidatorIcon />
    </div>
  );
}
