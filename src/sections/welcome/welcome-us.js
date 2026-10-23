import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { COLORS } from 'src/layouts/config-layout';
import Button from '@mui/material/Button';
import Logo from 'src/components/logo';
import { Grid, Stack, Box, Link } from '@mui/material';


const partners = [
  { name: 'Ultimate Solutions', logo: '/icons/ultimatesolutions.svg', url: 'https://ultimate.mn/en/' },
  { name: 'Khurgan Zeel', logo: '/icons/khurganzeel.svg', url: 'http://khurganzeel.mn/' },
  { name: 'Sono', logo: '/icons/sono.svg', url: 'https://sono.mn/' },
  { name: 'Mcredit', logo: '/icons/mcredit.svg', url: 'https://mcredit.mn/' },
  { name: 'Meloan', logo: '/icons/mcommerce.svg', url: 'https://meloan.mn/' },
  { name: 'UB Daathgal', logo: '/icons/ubdaatgal.svg', url: 'http://www.ubdaatgal.mn/' },
];

export default function WelcomeUs({ usRef }) {
  return (
    <Stack ref={usRef}>
      <Box
        sx={{
          pt: { xs: 6, md: 15 },
          pb: { xs: 10, md: 0 },
          display: 'flex',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'left',
          backgroundColor: COLORS.HeaderBg,
          position: 'relative',
          height: { xs: 'auto', md: '80vh' },
          overflow: 'hidden',
        }}
      >
        {/* <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Responsive direction
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 4, md: 8 }, // Space between text and video sections
          }}
        > */}
        {/* Text Section */}




        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: { xs: 1, md: 0.5 },
            ml: { xs: 2, sm: 4, md: '20%' },
            maxWidth: { xs: '100%', md: 'unset' },
            textAlign: { xs: 'left', md: 'left' }, // Center text on mobile
            zIndex: 2,
            mb: { xs: 4, md: '15%' },
          }}
        >
          <Box sx={{ width: { xs: '100%', md: '70%' } }}>
            <Typography
              variant="h4"
              sx={{
                color: 'black',
                fontWeight: 'normal',
                pb: 2,
              }}
            >
              МАНАЙ ТӨСЛИЙН МЕНЕЖЕРҮҮД
            </Typography>
            <Typography
              variant="h3"
              sx={{
                color: 'black',
                fontWeight: 'bold',
                pb: 2,
              }}
            >
              ТАНЫ БИЗНЕСИЙН ДАРААГИЙН ДИЖИТАЛ ПРОЦЕССИЙГ ЗАГВАРЧЛАНА.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'black',
                pb: 4,
                lineHeight: 1.5,
              }}
            >
              Таны бизнесийн онцлогт тохирох цор ганц дижитал өөрчлөлийн цогц системийг нэвтрүүлж бүтээмжийг нэмэгдүүлнэ.
            </Typography>
            <Button
              variant="contained"
              rel="noopener"
              sx={{
                backgroundColor: COLORS.ButtonColor,
                color: 'black',
                alignSelf: { xs: 'start', sm: 'start' },
                height: '40px',
                borderRadius: '0px',
                border: '2px solid black',
                fontSize: '13px',
                fontWeight: 300,
                '&:hover': {
                  backgroundColor: COLORS.ButtonColor,
                  opacity: 0.5,
                  boxShadow: '4px 4px 0 black',
                },
                boxShadow: '4px 4px 0 black',
                '&:active': { boxShadow: '4px 4px 0 black', },
              }}
            >
              Уулзалт товлох
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: { xs: '100%', md: 'auto' },
          }}
        >
          {/* <Box
            component="img"
            src={"/logo/people.svg"}
            sx={{
              width: { xs: '100%', sm: '80%', md: '900px' },
              maxWidth: '900px',
              height: 'auto',
              cursor: 'pointer',
              objectFit: 'contain',
            }}
          /> */}
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '100%',
            height: { xs: '60px', sm: '100px', md: '150px' },
            background: 'white',
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
            WebkitClipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
          }}
        />

        <Box sx={{
          position: 'absolute',
          top: '5%',
          left: '40%',
          display: { xs: 'none', md: 'block' },
          // zIndex: 2,
        }}>
          <Box
            component="img"
            src={"/icons/develop.svg"}
            sx={{
              width: '100%',
              cursor: 'pointer',
              objectFit: 'fill',
            }}
          />
        </Box>


        <Box sx={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          display: { xs: 'none', md: 'block' },
          // zIndex: 2,
        }}>
          <Box
            component="img"
            src={"/icons/einstein.svg"}
            sx={{
              width: '100%',
              cursor: 'pointer',
              objectFit: 'fill',
            }}
          />
        </Box>


        <Box sx={{
          position: 'absolute',
          top: '4%',
          left: '68%',
          display: { xs: 'none', md: 'block' },
          // zIndex: 2,
        }}>
          <Box
            component="img"
            src={"/icons/golive.svg"}
            sx={{
              width: '100%',
              cursor: 'pointer',
              objectFit: 'fill',
            }}
          />
        </Box>



        <Box sx={{
          position: 'absolute',
          top: '7%',
          right: '12%',
          display: { xs: 'none', md: 'block' },
          // zIndex: 2,
        }}>
          <Box
            component="img"
            src={"/icons/plan.svg"}
            sx={{
              width: '100%',
              cursor: 'pointer',
              objectFit: 'fill',
            }}
          />
        </Box>


        <Box sx={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          display: { xs: 'none', md: 'block' },
          // zIndex: 2,
        }}>
          <Box
            component="img"
            src={"/icons/process.svg"}
            sx={{
              width: '100%',
              cursor: 'pointer',
              objectFit: 'fill',
            }}
          />
        </Box>


        <Box sx={{
          position: 'absolute',
          bottom: '35%',
          left: '40%',
          display: { xs: 'none', md: 'block' },
          // zIndex: 2,
        }}>
          <Box
            component="img"
            src={"/icons/solutions.svg"}
            sx={{
              width: '100%',
              cursor: 'pointer',
              objectFit: 'fill',
            }}
          />
        </Box>



        <Box sx={{
          position: 'absolute',
          bottom: '20%',
          left: '30%',
          display: { xs: 'none', md: 'block' },
          // zIndex: 2,
        }}>
          <Box
            component="img"
            src={"/icons/test.svg"}
            sx={{
              width: '100%',
              cursor: 'pointer',
              objectFit: 'fill',
            }}
          />
        </Box>


        <Box sx={{
          position: 'absolute',
          bottom: '8%',
          left: '45%',
          display: { xs: 'none', md: 'block' },
          // zIndex: 2,
        }}>
          <Box
            component="img"
            src={"/icons/api.svg"}
            sx={{
              width: '100%',
              cursor: 'pointer',
              objectFit: 'fill',
            }}
          />
        </Box>


        <Box sx={{
          position: 'absolute',
          bottom: '8%',
          left: '65%',
          display: { xs: 'none', md: 'block' },
          // zIndex: 2,
        }}>
          <Box
            component="img"
            src={"/icons/bug.svg"}
            sx={{
              width: '100%',
              cursor: 'pointer',
              objectFit: 'fill',
            }}
          />
        </Box>


        <Box sx={{
          position: 'absolute',
          bottom: '8%',
          right: '10%',
          display: { xs: 'none', md: 'block' },
          // zIndex: 2,
        }}>
          <Box
            component="img"
            src={"/icons/tasks.svg"}
            sx={{
              width: '100%',
              cursor: 'pointer',
              objectFit: 'fill',
            }}
          />
        </Box>



      </Box>
      {/* </Box> */}

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} alignItems="center">
        {partners.map((p) => (
          <Grid key={p.name} item xs={6} sm={4} md={2}>
            <Stack alignItems="center" spacing={1}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
                <Box
                  component="img"
                  src={p.logo}
                  alt={p.name}
                  sx={{
                    width: { xs: 100, sm: 120, md: 140 },
                    height: 60,
                    objectFit: 'contain',
                    cursor: 'pointer',
                  }}
                />
              </a>
              <Link
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{
                  fontSize: 14,
                  color: 'black',
                  textAlign: 'center',
                  wordBreak: 'break-all',
                }}
              >
                {p.url}
              </Link>
            </Stack>
          </Grid>
        ))}
      </Grid>

      <div style={{ height: '50px' }} />

      <hr style={{ border: '1px solid #ccc', width: '90%', margin: '0 auto' }} />

    </Stack>
  );
}
