const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use('/repositories/:id', validateRepositoryId);
app.use(cors());

const repositories = [];

function validateRepositoryId (request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repository id."});
  }

  return next();
};

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoriesIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repository = { id, title, url, techs, likes: repositories[repositoriesIndex].likes };

  repositories[repositoriesIndex] = repository;

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoriesIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'  });
  }

  repositories.splice(repositoriesIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoriesIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repository = {
    id,
    title:repositories[repositoriesIndex].title,
    url: repositories[repositoriesIndex].url,
    techs: repositories[repositoriesIndex].techs,
    likes: repositories[repositoriesIndex].likes + 1
  };
  
  repositories[repositoriesIndex] = repository;

  return response.json(repository);
});

module.exports = app;
