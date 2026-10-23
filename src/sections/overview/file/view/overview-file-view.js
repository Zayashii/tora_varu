'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _folders, _files } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { UploadBox } from 'src/components/upload';
import { useSettingsContext } from 'src/components/settings';
//
import FileWidget from '../../../file-manager/file-widget';
import FileUpgrade from '../../../file-manager/file-upgrade';
import FileRecentItem from '../../../file-manager/file-recent-item';
import FileDataActivity from '../../../file-manager/file-data-activity';
import FileStorageOverview from '../../../file-manager/file-storage-overview';
//
import FileManagerPanel from '../../../file-manager/file-manager-panel';
import FileManagerFolderItem from '../../../file-manager/file-manager-folder-item';
import FileManagerNewFolderDialog from '../../../file-manager/file-manager-new-folder-dialog';
import { getFileList, deleteBannerImage } from 'src/api/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hooks';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const GB = 1000000000 * 24;

const TIME_LABELS = {
  week: ['Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat', 'Sun'],
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  year: ['2018', '2019', '2020', '2021', '2022'],
};

// ----------------------------------------------------------------------

export default function OverviewFileView() {
  const theme = useTheme();

  const smDown = useResponsive('down', 'sm');

  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuthContext();
  const router = useRouter();


  const settings = useSettingsContext();

  const [folderName, setFolderName] = useState('');

  const [files, setFiles] = useState([]);

  const newFolder = useBoolean();

  const upload = useBoolean();

  const image = useBoolean();

  const [data, setData] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [shownImage, setShownImage] = useState(null)

  async function getData() {
    setIsLoadingData(true)
    const { success, data } = await getFileList();
    console.log("res bn ->", data)

    if (!success) {
      enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
      logout()
      router.push(paths.auth.jwt.login);
      return;
    }
    console.log("data bn 3 ->", data)
    if (data !== null && data !== "") {
      setData(data)
    }
    // setTotal(data.totaldataqty)
    setIsLoadingData(false)
  }

  useEffect(() => {
    getData();
  }, [])

  const handleChangeFolderName = useCallback((event) => {
    setFolderName(event.target.value);
  }, []);

  const handleCreateNewFolder = useCallback(() => {
    newFolder.onFalse();
    setFolderName('');
    console.info('CREATE NEW FOLDER');
  }, [newFolder]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>

          <Grid xs={12} md={12} lg={12}>
            <div>
              <FileManagerPanel
                title="Файл-Жагсаалт"
                onOpen={upload.onTrue}
                sx={{ mt: 2 }}
              />

              {isLoadingData ? <LoadingScreen
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 1.5,
                  bgcolor: 'background.default',
                  height: '55vh',
                  width: '100%',
                }}
              /> : <Stack spacing={2}>
                {data.map((file, index) => (
                  <FileRecentItem
                    key={index}
                    file={file}
                    onOpen={() => {
                      image.onTrue()
                      setShownImage(file)
                    }}
                    onDelete={async () => {
                      const { success, msg, data } = await deleteBannerImage({ fileName: "banner/" + file })
                      if (!success) {
                        if (msg === "Дахин нэвтэрнэ үү!") {
                          enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
                          logout()
                          router.push(paths.auth.jwt.login);
                          return;
                        }
                      } else {
                        enqueueSnackbar(msg)
                        getData();
                      }
                    }}
                  />
                ))}
              </Stack>
              }
            </div>
          </Grid>

          {/* <Grid xs={12} md={6} lg={4}>
            <UploadBox
              onDrop={handleDrop}
              placeholder={
                <Stack spacing={0.5} alignItems="center" sx={{ color: 'text.disabled' }}>
                  <Iconify icon="eva:cloud-upload-fill" width={40} />
                  <Typography variant="body2">Upload file</Typography>
                </Stack>
              }
              sx={{
                mb: 3,
                py: 2.5,
                width: 'auto',
                height: 'auto',
                borderRadius: 1.5,
              }}
            />

            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>{renderStorageOverview}</Box>

            <FileUpgrade sx={{ mt: 3 }} />
          </Grid> */}
        </Grid>
      </Container>

      <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} getData={getData} />

      <ConfirmDialog
        open={image.value}
        maxWidth="md"
        onClose={() => {
          image.onFalse()
        }}
        title=""
        cancelText={"Хаах"}
        content={
          <Box sx={{ width: '100%', height: '80vh' }}>
            <Box
              component="img"
              src={HOST_API + "/banner/" + shownImage}
              sx={{
                width: 1,
                height: 1,
                flexShrink: 0,
                objectFit: 'contain',
              }}
            />
          </Box >

        }
      />
      {/* <FileManagerNewFolderDialog
        open={newFolder.value}
        onClose={newFolder.onFalse}
        title="New Folder"
        folderName={folderName}
        onChangeFolderName={handleChangeFolderName}
        onCreate={handleCreateNewFolder}
      /> */}
    </>
  )
}
