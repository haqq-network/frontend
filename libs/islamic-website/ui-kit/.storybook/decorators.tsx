import type { StoryFn, StoryContext } from '@storybook/react';

export function withoutPadding(Story: StoryFn, context: StoryContext) {
  return (
    <>
      <style>{`
        .sb-show-main { height: 100vh; }
        #storybook-root { width: 100%; height: 100%; margin: 0 !important; padding: 0 !important }
      `}</style>
      <Story {...context} />
    </>
  );
}

export function withStickyEmulation(Story: StoryFn, context: StoryContext) {
  return (
    <div className="storybook-sticky-emulation">
      <style>{`
        #storybook-root { height: 100vh; width: 100vw; position: relative; }
      `}</style>
      <div className="transform-gpu bg-[#252528] bg-opacity-75 backdrop-blur">
        <Story {...context} />
      </div>
    </div>
  );
}
