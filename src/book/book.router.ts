import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as bookService from "./book.service";
import { request } from "http";

export const bookRouter = express.Router();

//GET: List all books

bookRouter.get("/", async (request: Request, response: Response) => {
  try {
    const books = await bookService.listBooks();
    return response.status(200).json(books);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

//GET a book by id
bookRouter.get("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);

  try {
    const book = await bookService.getBook(id);
    if (book) {
      return response.status(200).json(book);
    }
    return response.status(404).json("book could not found");
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

//POST create a book
bookRouter.post(
  "/",
  body("title").isString(),
  body("authorId").isInt(),
  body("datePublished").isDate().toDate(),
  body("isFiction").isBoolean(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const book = request.body;
      const newBook = await bookService.createBook(book);

      return response.status(201).json(newBook);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

//PUT update a book by id
bookRouter.put(
  "/:id",
  body("title").isString(),
  body("authorId").isInt(),
  body("datePublished").isDate().toDate(),
  body("isFiction").isBoolean(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const id: number = parseInt(request.params.id, 10);
    try {
      const book = request.body;
      const updatedBook = await bookService.updateBook(book, id);

      return response.status(201).json(updatedBook);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

bookRouter.delete("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    await bookService.deleteBook(id);
    return response.status(204).json("Book successfully deleted");
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});
