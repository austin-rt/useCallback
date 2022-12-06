import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../constants';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  const getBookDetails = useCallback(async () => {
    const res = await axios.get(`${BASE_URL}/${id}`);
    setBook(res.data);
    console.log(res.data);
  }, [id]);

  useEffect(() => {
    getBookDetails();
  }, [getBookDetails]);

  return (
    <div className='book-details__page'>
      {book && (
        <section className='book-details__container'>
          <article className='book-details__card'>
            <img
              src={book.formats['image/jpeg']}
              alt={book.title}
              className='book-details__image'
            />
            <h2 className='book-details__title'>
              {book.title}
              {book.authors.map((author) => (
                <div
                  key={author.name}
                  className='book-details__authors'
                >
                  by: {author.name}
                </div>
              ))}
            </h2>
            <div className='book-details__downloads'>
              Downloads: {book.download_count.toLocaleString()}
            </div>
          </article>
        </section>
      )}
    </div>
  );
};
export default BookDetails;
