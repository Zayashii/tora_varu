'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback, useRef } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
// api
import { useGetProducts } from 'src/api/product';
// components
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import UserTableFiltersResult from '../user-table-filters-result';

import { getUserList } from 'src/api/dashboard';
import { LoadingScreen } from 'src/components/loading-screen';
import { Box, height, width } from '@mui/system';
import { useSnackbar } from 'src/components/snackbar';
import { RHFTextField } from 'src/components/hook-form';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import LoadingButton from '@mui/lab/LoadingButton';
import { addNote, getNotes, importUserByExcel } from 'src/api/user';
import Stack from '@mui/material/Stack';
import NoteItem from './note-item';
import UserNewEditForm from '../user-new-edit-form';
import { getUserDataById } from 'src/api/user';
import { useAuthContext } from 'src/auth/hooks';
import CashUserTableRow from '../cash-user-table-row';
// ----------------------------------------------------------------------



const TABLE_HEAD = [
  { id: 'sequence', label: '№', width: '10px' },
  { id: 'lname', label: 'Овог', },
  { id: 'fname', label: 'Нэр', },
  { id: 'rd', label: 'РД' },
  { id: 'cdate', label: 'Төлөв огноо' },
  { id: 'status', label: 'Төлөв', },
  { id: 'phone', label: 'Утас', },
  { id: 'laon', label: 'Зээлийн эрх' },
  { id: 'cash', label: 'КАСС нэр' },
  { id: '', label: '' },
];

const defaultFilters = {
  name: "",
  phone: "",
  rd: "",
};

// ----------------------------------------------------------------------

export default function CashUserListView() {
  const router = useRouter();
  const { logout } = useAuthContext();

  const table = useTable({
    defaultDense: true,
    defaultRowsPerPage: 50
  });
  const { enqueueSnackbar } = useSnackbar();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [isLoading, setIsLoading] = useState(true);

  const [reLoadData, setReloadData] = useState(false);

  const [total, setTotal] = useState(0);

  const [noteText, setNoteText] = useState("")
  const [noteId, setNoteId] = useState(null)
  const [isSavingNote, setIsSavingNote] = useState(false)

  const [notes, setNotes] = useState([])
  const [isLoadingNoteList, setIsLoadingNoteList] = useState(false)
  const [isDetailLoading, setIsDetailLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  // const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);


  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formdata = new FormData();
      formdata.append("file", file)
      const { success, data } = await importUserByExcel(formdata)
      if (success) {
        enqueueSnackbar(data)
        getData()
      } else {
        enqueueSnackbar(data, { variant: 'error' })
      }
    }
    //   setSelectedFile(file);
    // } else {
    //   setSelectedFile(null); // Reset if no file selected
    // }
  };

  const handleButtonClick = () => {
    fileInputRef.current.value = null;
    fileInputRef.current.click(); // Trigger the file input click
  };

  const getUserDetail = async (id) => {
    setIsDetailLoading(true);
    try {
      const { success, data } = await getUserDataById({ dataid: id })
      if (!success) {
        enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
        logout()
        router.push(paths.auth.jwt.login);
        return;
      }
      setCurrentUser(data.datalist[0])
      setIsDetailLoading(false);
    } catch (error) {
      console.log("catch error ", error);
      setIsDetailLoading(false);
    }
  }

  const getNoteList = async (id) => {
    setIsLoadingNoteList(true)
    try {
      const { success, data } = await getNotes({ dataid: id })
      if (!success) {
        enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
        logout()
        router.push(paths.auth.jwt.login);
        return;
      }
      setNotes(data.datalog)
      setIsLoadingNoteList(false)
    } catch (error) {
      setIsLoadingNoteList(false)
    }
  }

  const confirm = useBoolean();
  const noteList = useBoolean();
  const detailPage = useBoolean();

  const clearFilter = () => {
    setFilters(defaultFilters);
    table.onResetPage()
    setReloadData(!reLoadData);
  }

  async function getData() {
    setIsLoading(true)
    const { success, data } = await getUserList({ fname: filters.name, phone: filters.phone, regno: filters.rd, pageno: table.page + 1, pagesize: table.rowsPerPage });
    console.log("res bn ->", data)

    if (!success) {
      enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
      logout()
      router.push(paths.auth.jwt.login);
      return;
    }
    console.log("data bn 3 ->", data)
    data.datalist.map((el, index) => {
      el.sequence = table.page * table.rowsPerPage + index + 1
    })
    setTableData(data.datalist)
    setTotal(data.totaldataqty)
    setIsLoading(false)
  }

  useEffect(() => {
    getData();
  }, [reLoadData, table.rowsPerPage, table.page]);

  const dataInPage = tableData.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!tableData.length && canReset) || !tableData.length;

  const handleFilters = useCallback(
    (name, value) => {
      // table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataInPage.length,
    });
  }, [dataInPage.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      // router.push(paths.dashboard.product.details(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  function sortByKey(array, key, order = 'asc') {
    return array.sort((a, b) => {
      if (typeof a[key] === 'string' && typeof b[key] === 'string') {
        return order === 'asc'
          ? a[key].localeCompare(b[key]) // Ascending for strings
          : b[key].localeCompare(a[key]); // Descending for strings
      } else {
        return order === 'asc'
          ? a[key] - b[key] // Ascending for numbers
          : b[key] - a[key]; // Descending for numbers
      }
    });
  }

  useEffect(() => {
    // console.log("called ", table.order, table.orderBy);
    // console.log(tableData);
    // if (table.orderBy === "sequence") {
    //   setTableData([...tableData.reverse()])
    //   return
    // }
    var sortedData = [...sortByKey(tableData, table.orderBy, table.order)]
    setTableData(sortedData)
  }, [table.onSort]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Кассын харилцагч"
          links={[
            { name: '' },
          ]}
          action={
            <>
              <Stack sx={{ flexDirection: 'row' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'end',
                    border: '1px solid black',   // add this
                    padding: '8px',              // optional: spacing inside
                    borderRadius: '10px'          // optional: rounded corners
                  }}
                >
                  <p
                    style={{
                      color: '#969696',
                      fontSize: 15,
                    }}
                  >
                    Касс хэрэглэгч
                  </p>
                  <p
                    style={{
                      color: 'black',
                      fontSize: 14,
                      fontWeight: 'bold'
                    }}
                  >
                    2450
                  </p>
                </div>

                <div style={{ width: '10px' }} />

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'end',
                    border: '1px solid black',   // add this
                    padding: '8px',              // optional: spacing inside
                    borderRadius: '10px'          // optional: rounded corners
                  }}
                >
                  <p
                    style={{
                      color: '#969696',
                      fontSize: 15,
                    }}
                  >
                    Хүсэлт илгээсэн
                  </p>
                  <p
                    style={{
                      color: 'black',
                      fontSize: 14,
                      fontWeight: 'bold'
                    }}
                  >
                    2000
                  </p>
                </div>

                <div style={{ width: '10px' }} />

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'end',
                    border: '1px solid black',   // add this
                    padding: '8px',              // optional: spacing inside
                    borderRadius: '10px'          // optional: rounded corners
                  }}
                >
                  <p
                    style={{
                      color: '#969696',
                      fontSize: 15,
                    }}
                  >
                    Эрх тогтоосон
                  </p>
                  <p
                    style={{
                      color: 'black',
                      fontSize: 14,
                      fontWeight: 'bold'
                    }}
                  >
                    1500
                  </p>
                </div>

                <div style={{ width: '10px' }} />

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'end',
                    border: '1px solid black',   // add this
                    padding: '8px',              // optional: spacing inside
                    borderRadius: '10px'          // optional: rounded corners
                  }}
                >
                  <p
                    style={{
                      color: '#969696',
                      fontSize: 15,
                    }}
                  >
                    Гэрээний хүсэлт
                  </p>
                  <p
                    style={{
                      color: 'black',
                      fontSize: 14,
                      fontWeight: 'bold'
                    }}
                  >
                    1000
                  </p>
                </div>

                <div style={{ width: '10px' }} />

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'end',
                    border: '1px solid black',   // add this
                    padding: '8px',              // optional: spacing inside
                    borderRadius: '10px'          // optional: rounded corners
                  }}
                >
                  <p
                    style={{
                      color: '#969696',
                      fontSize: 15,
                    }}
                  >
                    Эрх татгалзсан
                  </p>
                  <p
                    style={{
                      color: 'black',
                      fontSize: 14,
                      fontWeight: 'bold'
                    }}
                  >
                    1000
                  </p>
                </div>
              </Stack>
            </>
            // <Button
            //   component={RouterLink}
            //   href={paths.dashboard.user.new}
            //   variant="contained"
            //   startIcon={<Iconify icon="mingcute:add-line" />}
            // >
            //   Шинэ харилцагч
            // </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          {/* <UserTableToolbar
            filters={filters}
            onFilters={handleFilters}
            clearFilter={clearFilter}
            reLoadData={reLoadData}
            setReloadData={() => {
              setReloadData(!reLoadData)
              table.onResetPage();
            }}
          //
          /> */}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {isLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {tableData
                        .map((row, index) => {
                          // row.sequence = table.page * table.rowsPerPage + index + 1;
                          return <CashUserTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}
                            page={table.page}
                            rowsPerPage={table.rowsPerPage}
                            index={index}
                            onSelectLoanHistory={() => router.push(paths.dashboard.user.loanHistory(row.id))}
                            handleOnEdit={() => router.push(paths.dashboard.user.edit(row.id))}
                            onAddNone={() => {
                              setNoteId(row.id)
                              confirm.onTrue();
                            }}
                            onNoteList={() => {
                              getNoteList(row.id)
                              noteList.onTrue()
                            }}
                            onDetail={() => {
                              router.push(paths.dashboard.user.cashDetail(row.id))
                              // detailPage.onTrue();
                            }}
                          />
                        })}
                    </>
                  )}

                  {isLoading ? <></> : <TableNoData notFound={notFound} />}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={total}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
            rowsPerPageOptions={[25, 50, 100, 150]}
          />
        </Card>
        <input
          ref={fileInputRef}
          type='file'
          id='userExcel'
          accept=".xlsx, .xls"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Container>

      {/* Тэмдэглэл оруулах */}
      <ConfirmDialog
        open={confirm.value}
        onClose={() => {
          setNoteText("");
          setNoteId(null);
          confirm.onFalse();
        }}
        title="Тэмдэглэл оруулах"
        content={
          <>
            <TextField
              value={noteText}
              fullWidth
              placeholder="Тэмдэглэл..."
              multiline
              rows={5}
              maxRows={5}
              onChange={(e) => setNoteText(e.target.value)}
            />
          </>
        }
        action={
          <LoadingButton
            variant="contained"
            loading={isSavingNote}
            onClick={async () => {
              if (noteText === "" || noteText === " ") {
                enqueueSnackbar("Тэмдэглэл оруулна уу", { variant: 'error' })
                return;
              }
              try {
                setIsLoading(true)
                const { success, data } = await addNote({
                  dataid: noteId,
                  note: noteText,
                });
                if (!success) {
                  enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
                  logout()
                  router.push(paths.auth.jwt.login);
                  return;
                }
                enqueueSnackbar("Тэмдэглэл амжилттай нэмлээ.");
                setIsLoading(false)
                // handleDeleteRows();
                console.log(noteText);
                setNoteText("");
                setNoteId(null);
                confirm.onFalse();
              } catch (error) {
                setIsLoading(false)
              }

            }}
          >
            Хадгалах
          </LoadingButton>
        }
      />

      {/* Тэмдэглэл жагсаалт */}
      <ConfirmDialog
        open={noteList.value}
        maxWidth="sm"
        onClose={() => {
          setNotes([]);
          noteList.onFalse();
        }}
        title="Тэмдэглэлүүд"
        cancelText={"Хаах"}
        content={
          isLoadingNoteList ?
            <Box sx={{ width: '100%', height: '60vh' }}>
              <LoadingScreen sx={{ width: '100%' }} />
            </Box > :
            <Box sx={{ width: '100%', height: '60vh' }}>
              <Stack spacing={2}>
                {notes.map((note, index) => (
                  <NoteItem
                    note={note.info}
                    user={note.createdusername}
                    date={note.cdate}
                  />
                ))}
              </Stack>
              <Box sx={{ height: "20px" }} />
            </Box >
        }
      />


      {/* Харилцагч дэлгэрэнгүй */}
      <ConfirmDialog
        open={detailPage.value}
        maxWidth="xxl"
        onClose={() => {
          setCurrentUser(null);
          detailPage.onFalse();
        }}
        title="Харилцагчийн дэлгэрэнгүй"
        cancelText={"Хаах"}
        content={
          isDetailLoading ?
            <Box sx={{ width: '100%', height: '80vh' }}>
              <LoadingScreen sx={{ width: '100%' }} />
            </Box > :
            <Box sx={{ width: '100%', height: '80vh' }}>
              <Box sx={{ height: "20px" }} />
              <UserNewEditForm currentUser={currentUser} isDetail={true} />
              <Box sx={{ height: "20px" }} />
            </Box >
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------
