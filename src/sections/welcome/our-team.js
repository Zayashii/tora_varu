// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _mock } from 'src/_mock';
// components
import { MotionViewport, varFade } from 'src/components/animate';
import { COLORS, HEADER } from 'src/layouts/config-layout';
import Logo from 'src/components/logo';
import { useRef, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box, Card, CardContent, CardHeader, Link } from '@mui/material';
import CarouselAnimation from '../_examples/extra/carousel-view/carousel-animation';
import CarouselBasic3 from '../_examples/extra/carousel-view/carousel-basic-3';
import useEmblaCarousel from 'embla-carousel-react'
import { DotButton, useDotButton } from 'src/components/embla-carousel/embla-carousel-dot-button';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from 'src/components/embla-carousel/embla-carousel-arrow-buttons';
import '../../styles/embla-styles.css';

// ----------------------------------------------------------------------

export default function OurTeam({ introRef }) {
  const mdUp = useResponsive('up', 'md');
  const smUp = useResponsive('up', 'sm');
  const lgUp = useResponsive('up', 'lg');

  const textRef = useRef(null);

  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      console.log("zxc ===========> ", textRef.current.offsetWidth)
      setTextWidth(textRef.current.offsetWidth); // Get the width of the content
    }
  }, []);


  const _carouselsExample = [...Array(20)].map((_, index) => ({
    id: _mock.id(index),
    title: _mock.postTitle(index),
    coverUrl: _mock.image.cover(index),
    description: _mock.description(index),
  }));


  // New data source for the services grid (shown under the header)
  const data = [
    {
      id: 1,
      position: 'Бизнес зөвлөх',
      coverUrl: '/assets/team/11.svg',
      name: "В.Балдандорж"
    },
    {
      id: 2,
      position: 'Төслийн менежер',
      coverUrl: '/assets/team/22.svg',
      name: "Б.Мөнхзаяа"
    }, {
      id: 3,
      position: 'UI/UX шинжээч',
      coverUrl: '/assets/team/33.svg',
      name: "В.Балдандорж"
    },
    {
      id: 4,
      position: 'Төслийн менежер',
      coverUrl: '/assets/team/11.svg',
      name: "Б.Мөнхзаяа"
    },
    {
      id: 5,
      position: 'Бизнес зөвлөх',
      coverUrl: '/assets/team/22.svg',
      name: "В.Балдандорж"
    }, {
      id: 6,
      position: 'UI/UX шинжээч',
      coverUrl: '/assets/team/33.svg',
      name: "Б.Мөнхзаяа"
    },
  ];
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start' })

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  useEffect(() => {
    console.log("selectedIndex=>", selectedIndex);
    console.log("scrollSnaps=>", scrollSnaps);

  }, [selectedIndex, scrollSnaps])

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <div
      id='module-container'
      component={MotionViewport}
      style={{
        height: `100%`,
        minHeight: '100vh',
        position: 'relative',
      }}
      ref={introRef}
    >
      <div
        style={{
          height: '100%'
        }}>
        <div
          style={{
            position: 'relative'
          }}>
        </div>

        {/* Services section (header + 5 cards) */}
        <div
          id='services-section'
          style={{
            paddingTop: '60px',
            paddingBottom: '20px',
            paddingLeft: lgUp ? '120px' : smUp ? '40px' : '16px',
            paddingRight: lgUp ? '120px' : smUp ? '40px' : '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              textAlign: 'left',
              width: '100%',
              justifySelf: 'start'
            }}
          >
            <div style={{ padding: '5px 15px', backgroundColor: COLORS.Orange, borderRadius: 25, }}>
              <p style={{ color: 'white', fontSize: '14px' }}>Манай баг</p>
            </div>

            <div style={{ height: '18px' }} />

            <p style={{ color: 'black', fontSize: '48px', fontWeight: 'bold' }}>Манай баг IT төслийн бүх шатны мэргэшсэн ур чадвартай </p>

            <div style={{ height: '118px' }} />

            {/* <CarouselAnimation data={data} /> */}
            {/* <Box height={'300px'}>
              <Card>
                <CardHeader title="Carousel Basic 3" />
                <CardContent>
                  <CarouselBasic3 data={_carouselsExample.slice(8, 12)} />
                </CardContent>
              </Card>
            </Box> */}

            <section className="embla">
              <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                  {Array.from(Array(data.length).keys()).map((index) => (
                    <div className="embla__slide" key={index}>
                      {/* <div className="embla__slide__number">{index + 1}</div> */}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <img
                          src={data[index].coverUrl}
                          alt={`Slide ${index + 1}`}
                          style={{ width: '100%', height: 'auto', marginBottom: '16px' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                          <p style={{ fontSize: '14px', margin: 0, padding: 0, textAlign: 'center' }}>{data[index].position}</p>
                          <div style={{ width: '128px' }} />
                          <p style={{ fontSize: '14px', color: '#666', margin: 0, padding: 0, textAlign: 'center' }}>{data[index].name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="embla__controls">
                {/* <div className="embla__buttons">
                  <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                  <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div> */}

                <div className="embla__dots">
                  {scrollSnaps.map((_, index) => (
                    <DotButton
                      key={index}
                      onClick={() => onDotButtonClick(index)}
                      className={'embla__dot'.concat(
                        index === selectedIndex ? ' embla__dot--selected' : ''
                      )}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>

      <div style={{ height: '80px' }} />

      {/* <hr style={{ border: '1px solid #ccc', width: '90%', margin: '0 auto' }} /> */}

      <div style={{
        height: '20px'
      }} />
    </div >
  );
}
