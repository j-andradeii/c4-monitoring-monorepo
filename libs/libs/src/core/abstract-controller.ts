export class AbstractController { 
    response<T>(response: T, statusCode: number) {
        return {
          data: response,
          statusCode
        }
    }
}