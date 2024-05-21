import axios from 'axios';

const BASE_URL = 'https://openlibrary.org';

export const fetchBooks = async (page = 1, pageSize = 10) => {
  const response = await axios.get(`${BASE_URL}/subjects/science.json?limit=${pageSize}&offset=${(page - 1) * pageSize}`);
  return response.data;
};

export const fetchAuthorDetails = async (authorKey) => {
  const response = await axios.get(`${BASE_URL}${authorKey}.json`);
  return response.data;
};
