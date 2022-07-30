import axios from "axios";

const baseUrl = 'https://daggoe.herokuapp.com'

async function getDogs(username){
    const dogs = await axios.get(`${baseUrl}/api/dogs/${username}`);
    return dogs.data;
}

async function insertDog(dog, username){
    try{
        const insertRequets = await axios.post(`${baseUrl}/api/insert`,{
            dog,username
        });
        return insertRequets;
    }catch(err){
        throw err;
    }
}

async function updateDog(dog,oldname,username){
    const updateRequest = await axios.put(`${baseUrl}/api/update`,{
        dog,oldname,username
    });
    return updateRequest
}

async function deleteDog(dog,username){
    const deleteRequest = await axios.delete(`${baseUrl}/api/delete`,{
        data:{
            username,
            dogname: dog.dogName
        }
    })
    return deleteRequest;
}

export {
    getDogs,
    insertDog,
    updateDog,
    deleteDog,
}