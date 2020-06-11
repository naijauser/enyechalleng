import axios from 'axios'

const resources: any = {};

const makeRequestCreator = () => {
  let cancel: any;

  return async (query: string) => {
    if (cancel) {
        cancel.cancel();
    }

    cancel = axios.CancelToken.source();

    try {
      if (resources[query]) {
        return resources[query];
      }

      const res = await axios(query, {cancelToken: cancel.token});

      const result = res.data.results;

      resources[query] = result;
      
      return result;
    } catch (error) {
      if (axios.isCancel(error)) {
        // console.log('Request cancled', error.message);
      } else {
        // console.log('Something went wrong: ', error.message);
      }
        
    }
  } 
}

export const search = makeRequestCreator();