import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
// components
import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import { uploadBannerImage } from 'src/api/settings';


// ----------------------------------------------------------------------

export default function FileManagerNewFolderDialog({
  title = 'Баннер зураг сонгох',
  open,
  onClose,
  //
  onCreate,
  onUpdate,
  //
  folderName,
  onChangeFolderName,
  getData,
  ...other
}) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

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

  const handleUpload = async () => {
    if (files.length === 0) {
      enqueueSnackbar("Файл сонгоно уу!", { variant: 'error' })
      return;
    }
    try {
      setIsUploading(true)
      console.info('ON UPLOAD', files);
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const formdata = new FormData();
        formdata.append("file", file)
        const { success, data } = await uploadBannerImage(formdata);
        if (!success) {
          enqueueSnackbar("Файл upload хийхэд алдаа гарлаа!", { variant: 'error' })
          setIsUploading(false)
          return;
        }
      }
      setIsUploading(false)
      getData();
      onClose();
    } catch (error) {
      setIsUploading(false)
      enqueueSnackbar("Файл upload хийхэд алдаа гарлаа!", { variant: 'error' })
    }
  };

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}

        <Upload accept={{ 'image/*': [] }} multiple files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
      </DialogContent>

      <DialogActions>
        <LoadingButton
          loading={isUploading}
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
        >
          Upload
        </LoadingButton>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )}

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? 'Save' : 'Create'}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}

FileManagerNewFolderDialog.propTypes = {
  folderName: PropTypes.string,
  onChangeFolderName: PropTypes.func,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
};
