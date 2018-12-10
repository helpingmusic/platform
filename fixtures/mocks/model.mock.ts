
export function CreateModelMock(model: string) {
  return {
    name: model,
    findById: jest.fn().mockResolvedValue({}),
    findOne: jest.fn().mockResolvedValue({}),
    find: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockImplementation(async doc => doc),
  };
}