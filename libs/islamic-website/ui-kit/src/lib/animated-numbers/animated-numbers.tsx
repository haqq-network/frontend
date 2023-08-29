'use client';
import {
  CSSProperties,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Spring, animated, SpringConfig } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';

type configsFn = (numberValue: number, index: number) => SpringConfig;

const NUMBERS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5,
  6, 7, 8, 9,
];

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// lib
export function AnimatedNumbers({
  animateToNumber,
  fontStyle,
  configs,
  includeComma,
  locale,
  separator,
}: {
  animateToNumber: number;
  fontStyle?: CSSProperties;
  includeComma?: boolean;
  separator?: string;
  configs?: SpringConfig[] | configsFn;
  locale?: string;
}) {
  const { ref, inView } = useInView({ triggerOnce: true });
  const keyCount = useRef(0);
  const [numberHeight, setNumberHeight] = useState(0);
  const animateToNumberString = useMemo(() => {
    return separator
      ? Math.abs(animateToNumber)
          .toLocaleString(locale || 'en-US', {
            useGrouping: true,
          })
          .replace(/,/g, separator)
      : String(Math.abs(animateToNumber));
  }, [animateToNumber, separator, locale]);
  const animateToNumbersArr = useMemo(() => {
    return Array.from(animateToNumberString).map((x, idx) => {
      const parsedNumber = Number.parseInt(x);

      return Number.isNaN(parsedNumber)
        ? animateToNumberString[idx]
        : parsedNumber;
    });
  }, [animateToNumberString]);

  const numberDivRef = useRef<HTMLDivElement>(null);

  const getConfig = useCallback(
    (
      configs: SpringConfig[] | configsFn | undefined,
      number: number,
      index: number,
    ) => {
      if (configs) {
        if (typeof configs === 'function') {
          return configs(number, index);
        }

        return configs
          ? configs[getRandomIntInclusive(0, configs.length - 1)]
          : undefined;
      }
    },
    [],
  );

  useEffect(() => {
    if (numberDivRef.current) {
      const height = numberDivRef.current.getClientRects()?.[0]?.height;

      if (height) {
        setNumberHeight(height);
      }
    }
  }, [animateToNumber, fontStyle]);

  return (
    <>
      {numberHeight !== 0 && (
        <div
          ref={ref}
          style={{ display: 'flex', flexDirection: 'row' }}
          className="animated-container"
        >
          {inView && animateToNumber < 0 && <div style={fontStyle}>-</div>}
          {inView &&
            animateToNumbersArr.map((n, index) => {
              if (typeof n === 'string') {
                return (
                  <div key={index} style={{ ...fontStyle, minWidth: 12 }}>
                    {n}
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  style={{
                    height: numberHeight,
                    overflow: 'hidden',
                  }}
                >
                  <Spring
                    key={`${keyCount.current++}`}
                    from={{
                      transform: 'translateY(0px)',
                    }}
                    to={{
                      transform: `translateY(${
                        -1 *
                          (numberHeight *
                            Number.parseInt(
                              String(animateToNumbersArr[index]),
                            )) -
                        numberHeight * 20
                      })`,
                    }}
                    config={getConfig(configs, n, index)}
                  >
                    {(props) => {
                      return NUMBERS.map((number, i) => {
                        return (
                          <animated.div
                            key={i}
                            style={{ ...fontStyle, ...props }}
                          >
                            {number}
                          </animated.div>
                        );
                      });
                    }}
                  </Spring>
                </div>
              );
            })}
        </div>
      )}

      <div
        ref={numberDivRef}
        style={{ position: 'absolute', top: -9999, ...fontStyle }}
      >
        {0}
      </div>
    </>
  );
}

export const MemoizedAnimatedNumbers = memo(
  AnimatedNumbers,
  (prevProps, nextProps) => {
    return (
      prevProps.animateToNumber === nextProps.animateToNumber &&
      prevProps.fontStyle === nextProps.fontStyle &&
      prevProps.includeComma === nextProps.includeComma
    );
  },
);
