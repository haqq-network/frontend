'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import store from 'store2';
import { ValidatorIcon } from '@haqq/shell-ui-kit';

const avatarsCacheKey = 'validator_avatars';

export function ValidatorAvatar({ identity }: { identity?: string }) {
  const [avatarsCache, setAvatarsCache] = useState<Record<string, string>>(
    store.get(avatarsCacheKey) ?? {},
  );
  const getAvatarFromKeybase = useCallback(async (identity: string) => {
    const { data } = await axios.get(
      `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`,
    );

    return data;
  }, []);

  useEffect(() => {
    store.set(avatarsCacheKey, avatarsCache);
  }, [avatarsCache]);

  useEffect(() => {
    (async () => {
      if (identity) {
        if (!avatarsCache[identity]) {
          const keyBaseData = await getAvatarFromKeybase(identity);
          if (Array.isArray(keyBaseData.them) && keyBaseData.them.length > 0) {
            const uri = String(
              keyBaseData.them[0]?.pictures?.primary?.url,
            ).replace(
              'https://s3.amazonaws.com/keybase_processed_uploads/',
              '',
            );

            if (uri) {
              setAvatarsCache({
                ...avatarsCache,
                [identity]: uri,
              });
            }
          }
        }
      }
    })();
  }, [setAvatarsCache, getAvatarFromKeybase, identity, avatarsCache]);

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
      {logo && <img src={logo} alt="" className="object-cover" />}
      <ValidatorIcon />
    </div>
  );
}
