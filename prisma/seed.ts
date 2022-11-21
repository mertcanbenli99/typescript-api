import { db } from "../src/util/db.server";

type Author = {
  firstName: string;
  lastName: string;
};

type Book = {
  title: string;
  isFiction: boolean;
  datePublished: Date;
};

function getAuthors(): Array<Author> {
  return [
    {
      firstName: "Mert",
      lastName: "Benli",
    },
    {
      firstName: "Eda",
      lastName: "Benli",
    },
    {
      firstName: "Elon",
      lastName: "Musk",
    },
  ];
}

function getBooks(): Array<Book> {
  return [
    {
      title: "Sapiens",
      isFiction: false,
      datePublished: new Date(),
    },
    {
      title: "Midnight Library",
      isFiction: true,
      datePublished: new Date(),
    },
  ];
}

async function seed() {
  await Promise.all(
    getAuthors().map((author) => {
      return db.author.create({
        data: {
          firstName: author.firstName,
          lastName: author.lastName,
        },
      });
    })
  );

  const author = await db.author.findFirst({
    where: {
      firstName: "Elon",
    },
  });
  
  await Promise.all(
    getBooks().map((book) => {
      const { title, isFiction, datePublished } = book;
      return db.book.create({
       data: {
        title,
        isFiction,
        datePublished,
        authorId: author.id,
        
 
       },
      });
    })
  );
}

seed();
