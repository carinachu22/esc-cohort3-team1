const mockResponse = {
  data: {
    results: [
      {
        name: {
          first: "name",
        },
      },
    ],
  },
};

export default {
  get: jest.fn().mockResolvedValue(),
};
