# 📖 Minimalist Book Manager API

## Introduction

This is the starter repository for the Further APIs session. It provides a start to creating a Minimalist Book Manager API.

### Pre-Requisites

- NodeJS installed (v18.12.1 Long Term Support version at time of writing)

### Technologies & Dependencies

- [TypeScript](https://www.typescriptlang.org/)
- [ExpressJS](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [SQLite3](https://www.npmjs.com/package/sqlite3)
- [Jest](https://jestjs.io/)
- [Supertest](https://www.npmjs.com/package/supertest)
- [ESLint](https://eslint.org/)

### How to Get Started

- Fork this repo to your Github and then clone the forked version of this repo

### Running the application

In order to run the unit tests run, firstly install the dependencies (if you haven't already done so)

```
npm install
```

Followed by:

```
npm start
```

### Running the Unit Tests

In order to run the unit tests run, firstly install the dependencies (if you haven't already done so)

```
npm install
```

Followed by:

```
npm test
```

### Tasks

Here are some tasks for you to work on:

📘 Task 1: Implement the following User Story with tests.

`User Story: As a user, I want to use the Book Manager API to delete a book using its ID`

📘 Extension Task: Oh no! 😭 We've only covered the happy paths in the solution, can you figure out a way
to add in exception handling to the project?

- Clue 1: What if someone wants to add a book with an ID for a book that already exists? How do we handle this gracefully?

- Clue 2: What if someone wants to find a book by an ID that doesn't yet exist?
  How can we improve the API by handling errors gracefully and show a helpful message to the client?

### Notes

I could not figure out how to complete the extension for this lab.

The `saveBook` function in books_controller.ts currently uses a try/catch to handle exceptions if someone tries to add a book with an ID for a book that already exists, however this only returns an error message of `"message": "Validation Error"`.

The full error object from sequelize does include a more useful error message `"message": "bookId must be unique"` however I couldn’t seem to access this when error was being used `as Error` because of how it was nested within the object properties.

I was able to access the more detailed error message if I imported sequelize into books_controller.ts and changed:

    catch (error) {
    	res.status(400).json({
    		message: (error as Error).message,
    	});
    }

To:

    catch (error) {
    	res.status(400).json({
    		message: (error as sequelize.ValidationError).errors[0].message,
    	});
    }

This worked in Postman, however it caused the test for "status code 400 when saving ill formatted JSON" to fail with TypeError: Cannot read properties of undefined (reading '0') and thrown: "Exceeded timeout of 5000 ms for a test".

Instead I tried adding a check to the `saveBook` function in the service layer as so:

    export const saveBook = async (book: Book) => {
    	const checkId = await Book.findByPk(book.bookId);

    	if (checkId) {
    		throw new Error("BookId Already Exists");
    	}
    	return Book.create<Book>(book);
    };

Again, this seemed to work in Postman but I was unable to then write a test for the service layer that successfully caught this error. I tried the following as a test:

    test("", async () => {
    	const bookToBeSaved = {
    		bookId: 3,
    		title: "Fantastic Mr. Fox",
    		author: "Roald Dahl",
    		description:
    			"A wiley and clever fox feeds his family by stealing from three mean farmers.",
    	} as Book;

    	expect(async () => {
    		await bookService.saveBook(bookToBeSaved);
    	}).toThrow("BookId Already Exists");
    });

But jest failed with the error “Cannot log after tests are done. Did you forget to wait for something async in your test?”

I was unable to figure out the correct way to update the code to solve this extension exercise.
