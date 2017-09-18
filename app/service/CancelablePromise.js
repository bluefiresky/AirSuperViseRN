/**
 *
 * Created by weimeng on 16/5/18.
 * © 2016 NCF GROUP ALL RIGHTS RESERVED
 */


export class CancelablePromise extends Promise{


  constructor(props) {
    super(props)
    this._hasCanceled = false

    const _s = this
    this.wrapper =  ( callback ) => {
      return (value) => {
        if( !_s._hasCanceled ) {
          if(callback)
            callback(value)
        } else {
          // console.log("operation canceled")
        }
      }

    }
  }



  then(onFulfilled,onRejected){
    super.then(this.wrapper(onFulfilled),this.wrapper(onRejected))
    return this
  }

  catch(onRejected){
    super.catch(this.wrapper(onRejected))
    return this
  }


  resolve(value) {
    // console.log("resolving...")
    if(!this._hasCanceled){
      super.resolve(value)
    } else{
      // console.log("resolve canceled...")
    }
  }

  reject(value){

    if(!this._hasCanceled){
      super.reject(value)
    } else {
      // console.log("reject canceled...")
    }

  }

  cancel() {
    this._hasCanceled = true
  }

}

CancelablePromise.all = (iterable) => {
  const promise = Promise.all(iterable)

  const _s = this
  return new CancelablePromise((resolve, reject) => {
    promise.then(data => {
      resolve(data)
    })
    promise.catch(e => {
      // console.log(e)
      reject (e)
    })
  })
}
