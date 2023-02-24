import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../constants';
import { Book } from '../models/interfaces';

const Books = () => {
  const [books, setBooks] = useState<Book[] | null>(null);

  const getList = async () => {
    const res = await axios.get(`${BASE_URL}`);
    setBooks(res.data.results);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className='book-list__page'>
      <section className='book-list__container'>
        {books?.map(book => (
          <Link
            to={`/${book.id}`}
            key={book.id}
          >
            <article className='book-list__card'>
              <img
                src={book.formats['image/jpeg']}
                alt={book.title}
                className='book-list__image'
              />
              <h2 className='book-list__title'>{book.title}</h2>
            </article>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default Books;
