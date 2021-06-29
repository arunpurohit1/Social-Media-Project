import React,{useEffect ,useState} from 'react';




const Home = () => {
     
    const [data , setData] = useState([])

    useEffect(() =>{
      fetch("/api/v2/user/allPosts" , {
           headers:{
             "Authorization": "Bearer "+localStorage.getItem('jwt')
           }
      }
    ).then(res=> res.json())
    .then(result =>{
      setData(result.posts)
      
    })
  },[])

    const likePost = (id) => {
      fetch("/api/v2/user/like", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          //   console.log(result)
          window.location.reload()
        });
    };
    const unlikePost = (id) => {
      fetch("/api/v2/user/unlike", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
             window.location.reload();
        });
    };

      const makeComment = (text, postId) => {
        fetch("/api/v2/user/comment", {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            postId,
            text,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
              window.location.reload();
          })
          .catch((err) => {
            console.log(err);
          });
      };
    

    return (
      <div className="Home">
      {
      data.map(item => {
          return (
            <div className="card home-card" key={item._id}>
              <h5>{item.name}</h5>
            
              <h4>{item.title}</h4>
              <p>{item.body}</p>
              <div className="card-content">
                <i className="material-icons">favorite</i>
                <i
                  className="material-icons"
                  onClick={() => {
                    unlikePost(item._id);
                  }}
                >
                  thumb_down
                </i>
                <i
                  className="material-icons"
                  onClick={() => {
                    likePost(item._id);
                  }}
                >
                  thumb_up
                </i>

                <h6>{item.likes.length} likes</h6>
                {item.comments.map((record) => {
                  return (
                    <h6 key={record._id}>
                      <span style={{ fontWeight: "500" }}>
                        {record.postedBy.name}
                      </span>{" "}
                      {record.text}
                    </h6>
                  );
                })}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(e.target[0].value, item._id);
                  }}
                >
                  <input type="text" placeholder="add a comment" />
                </form>
                <p>this is amazing post</p>
              </div>
            </div>
          );
      })
    }
    </div>  
    );
      
}


export default Home