'use client';

import { useState, useCallback } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
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
// _mock
import { _orders, ORDER_STATUS_OPTIONS } from 'src/_mock';
// utils
import { fTimestamp } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//
import QuestionAndAnswerTableRow from '../question-and-answer-table-row';

import { deleteQuestion, getQuestionAndAnswerList } from 'src/api/settings';
import { useEffect } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import { width } from '@mui/system';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
import _ from 'lodash';
import { updateQuestionAnswers } from 'src/api/settings';

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'no', label: '№', width: '10px' },
  { id: 'Асуулт', label: 'Асуулт', width: "40%" },
  { id: 'Үүсгэсэн өдөр', label: 'Үүсгэсэн өдөр' },
  { id: 'Сүүлд өөрчилсөн өдөр', label: 'Сүүлд өөрчилсөн өдөр' },
  { id: '', label: '' },
];

const defaultFilters = {
  name: null,
  phone: null,
  rd: null,
};

// ----------------------------------------------------------------------

export default function QuestionAndAnswerListView() {
  const table = useTable();
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuthContext();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [isLoading, setIsLoading] = useState(true);

  const [reLoadData, setReloadData] = useState(false);

  const [questionAnswerInitialData, setQuestionAnswerInitialData] = useState([])

  const [total, setTotal] = useState(0);

  const clearFilter = () => {
    setFilters(defaultFilters);
    table.onResetPage();
    // setReloadData(!reLoadData);
  }

  async function getData() {
    setIsLoading(true)
    // table.onResetPage();
    const { success, msg, data } = await getQuestionAndAnswerList();
    console.log("res bn ->", data)

    if (!success) {
      if (msg === "Дахин нэвтэрнэ үү!") {
        enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
        logout()
        router.push(paths.auth.jwt.login);
        return;
      } else {
        enqueueSnackbar(msg, { variant: 'error' })
        return;
      }
    }

    var questions = [];

    for (let index = 0; index < data.questions.length; index++) {
      const question = data.questions[index];
      const answers = [];
      for (let j = 0; j < data.answers.length; j++) {
        const answer = data.answers[j];
        if (question.id === answer.questionId) {
          answers.push(answer)
        }
      }
      question.answers = answers
      questions.push(question)
    }

    console.log("questions", questions);

    console.log("data bn 2 ->", questions)
    setTableData(questions)
    setQuestionAnswerInitialData(_.cloneDeep(questions))
    setIsLoading(false)
  }

  const updateQuestion = (value, id) => {
    const foundElement = tableData.find((el) => el.id === id)
    if (foundElement) {
      foundElement.question = value;
      setTableData([...tableData])
    }
  }

  const updateAnswer = (value, questionId, answerId) => {
    console.log(value, questionId, answerId);

    const foundElement = tableData.find((el) => el.id === questionId)
    if (foundElement) {
      if (answerId) {
        console.log("here");
        const foundAnswer = foundElement.answers.find((el) => el.id === answerId)
        if (foundAnswer) {
          foundAnswer.answer = value
          setTableData([...tableData])
        }
      }
      else {
        let lastAnswer = foundElement.answers[foundElement.answers.length - 1];
        lastAnswer.answer = value
        setTableData([...tableData])
      }
    }
  }

  const addNewAnswer = (questionId) => {
    const foundElement = tableData.find((el) => el.id === questionId)
    if (foundElement) {
      if (foundElement.answers.length > 0) {
        const lastAnswer = foundElement.answers[foundElement.answers.length - 1];
        if (lastAnswer.answer) {
          foundElement.answers.push(
            {
              answer: "",
            }
          )
        } else {
          enqueueSnackbar("Хариултаа бүрэн оруулна уу.", { variant: 'error' })
          return;
        }
      } else {
        foundElement.answers.push(
          {
            answer: "",
          }
        )
      }
      setTableData([...tableData])
    }
  }

  const removeAnswer = (questionId, answerIndex) => {
    console.log(questionId, answerIndex);
    const foundElement = tableData.find((el) => el.id === questionId)
    if (foundElement) {
      foundElement.answers.splice(answerIndex, 1)
      setTableData([...tableData])
    }
  }

  useEffect(() => {
    getData();
  }, [reLoadData, table.rowsPerPage, table.page]);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

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
    async (id) => {
      console.log("deleted question id ", id);
      const { success, msg, data } = await deleteQuestion({ id: id });
      if (!success) {
        if (msg === "Дахин нэвтэрнэ үү!") {
          enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
          logout()
          router.push(paths.auth.jwt.login);
          return;
        } else {
          enqueueSnackbar(msg, { variant: 'error' })
          return;
        }
      }
      enqueueSnackbar(msg)
      getData();
    },
    [tableData.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: tableData.length,
      totalRowsFiltered: tableData.length,
    });
  }, [tableData.length, tableData.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Асуулт хариулт жагсаалт"
          links={[
            { name: 'Жагсаалт' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        {isLoading ? (
          <LoadingScreen
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 1.5,
              bgcolor: 'background.default',
              height: '55vh',
              width: '100%',
            }}
          />
        ) : < Card >

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
                  {tableData
                    .map((row, index) => (
                      <QuestionAndAnswerTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => {
                          console.log(tableData);
                          const foundItem = tableData.find(el => el.id === row.id);
                          if (foundItem) {
                            console.log("saved item", foundItem);
                            // setEditingDataInitial(Object.assign({}, foundItem))
                            // console.log("saved editingDataInitial", editingDataInitial);
                            foundItem.isEditing = true;
                            foundItem.answers.map((answer) => {
                              answer.isEditing = true;
                            })
                            setTableData(tableData)
                          }
                        }}
                        page={table.page}
                        rowsPerPage={table.rowsPerPage}
                        index={index}
                        onDone={async () => {
                          console.log("bolnodoo", tableData);
                          const foundItem = tableData.find(el => el.id === row.id);
                          if (foundItem) {
                            var body = {}
                            body.questions = foundItem
                            body.answers = foundItem.answers
                            delete body.questions.isEditing
                            delete body.questions.answers
                            for (let index = 0; index < body.answers.length; index++) {
                              const answer = body.answers[index];
                              delete answer.isEditing
                            }
                            console.log("body", body);
                            const { success, msg, data } = await updateQuestionAnswers(body);
                            if (!success) {
                              if (msg === "Дахин нэвтэрнэ үү!") {
                                enqueueSnackbar("Дахин нэвтэрнэ үү!", { variant: 'error' })
                                logout()
                                router.push(paths.auth.jwt.login);
                                return;
                              } else {
                                enqueueSnackbar(msg, { variant: 'error' })
                                return;
                              }
                            } else {
                              enqueueSnackbar(msg)
                              getData();
                            }
                          }
                        }}
                        onCancelEdit={() => {
                          console.log(tableData);
                          var foundItemIndex = tableData.findIndex(el => el.id === row.id);
                          if (foundItemIndex !== -1) {
                            var foundInitialData = questionAnswerInitialData.find(el => el.id === row.id);
                            console.log("restored item ", foundInitialData);
                            tableData[foundItemIndex] = Object.assign({}, foundInitialData);
                            console.log("llar", Object.assign({}, foundInitialData));
                            console.log("restored item2 ", tableData[foundItemIndex]);
                            tableData[foundItemIndex].isEditing = false;
                            setTableData([...tableData])
                          }
                        }}
                        updateQuestion={updateQuestion}
                        updateAnswer={updateAnswer}
                        addNewAnswer={addNewAnswer}
                        removeAnswer={removeAnswer}
                      />
                    ))}

                  {/* <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  /> */}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {/* <TablePaginationCustom
            count={total}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          /> */}
        </Card>}
      </Container >

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}