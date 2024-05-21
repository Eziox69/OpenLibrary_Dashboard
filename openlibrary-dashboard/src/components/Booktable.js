import React, { useEffect, useState } from 'react';
import { fetchBooks, fetchAuthorDetails } from '../Services/bookService';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  TableSortLabel, Paper, CircularProgress
} from '@mui/material';

const BookTable = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchBooks(page + 1, pageSize);
        const booksWithAuthors = await Promise.all(
          data.works.map(async (book) => {
            const authorDetails = await fetchAuthorDetails(book.authors[0].key);
            return {
              ...book,
              authorName: authorDetails.name,
              authorBirthDate: authorDetails.birth_date,
              authorTopWork: authorDetails.top_work
            };
          })
        );
        setBooks(booksWithAuthors);
        setTotal(data.work_count);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedBooks = [...books].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={(e) => handleRequestSort(e, 'title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'authorName'}
                  direction={orderBy === 'authorName' ? order : 'asc'}
                  onClick={(e) => handleRequestSort(e, 'authorName')}
                >
                  Author Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'first_publish_year'}
                  direction={orderBy === 'first_publish_year' ? order : 'asc'}
                  onClick={(e) => handleRequestSort(e, 'first_publish_year')}
                >
                  First Publish Year
                </TableSortLabel>
              </TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'ratings_average'}
                  direction={orderBy === 'ratings_average' ? order : 'asc'}
                  onClick={(e) => handleRequestSort(e, 'ratings_average')}
                >
                  Ratings Average
                </TableSortLabel>
              </TableCell>
              <TableCell>Author Birth Date</TableCell>
              <TableCell>Author Top Work</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBooks.map((book) => (
              <TableRow key={book.key}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.authorName}</TableCell>
                <TableCell>{book.first_publish_year}</TableCell>
                <TableCell>{book.subject ? book.subject.join(', ') : ''}</TableCell>
                <TableCell>{book.ratings_average}</TableCell>
                <TableCell>{book.authorBirthDate}</TableCell>
                <TableCell>{book.authorTopWork}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 50, 100]}
      />
    </Paper>
  );
};

export default BookTable;
