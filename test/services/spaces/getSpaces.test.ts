import { STATUS_CODES } from "http";
import { getSpaces } from "../../../src/services/spaces/getSpaces";

const someItems = {
    Items: [{
        id: {
            S: '123'
        },
        location: {
            S: 'Paris'
        }
    }]
}


describe('getSpaces tgst',() => {

    const ddbClientMock = {
        send: jest.fn()
    }

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('should return spaces if no queryStringParameters', async () => {
        ddbClientMock.send.mockResolvedValueOnce(someItems);
        const getResult = await getSpaces({} as any, ddbClientMock as any);
        const expectedResult = {
            statusCode: 201,
            body: JSON.stringify([{
                id: '123',
                location: 'Paris'
            }])
        }
        expect(getResult).toEqual(expectedResult);
    })
})