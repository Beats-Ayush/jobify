const notFoundMiddleWare = (req, res) => {
  res.status(404).end("Route does not exist");
};

export default notFoundMiddleWare;
