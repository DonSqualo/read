import {useState, useContext} from 'react'
import { AuthContext } from './AuthContext';
import {backendPath} from "./consts/constants.ts"


interface Item {
    title: string
    author: string
    content: string
    summary: string
    link: string
    type: string
}

const NewItem = () => {
    const [formExpanded, setFormExpanded] = useState<boolean>(false);
    const [formInput, setFormInput] = useState<Item>({title: "", author: "me", content: "", summary: "", link: "", type: "read"});
    const { authToken, refreshCount, setRefreshCount } = useContext(AuthContext);

    const handleClick = () => {
        setFormExpanded(!formExpanded)
        console.log("d")
      };
    const addItem = async (formInput: any) => {
        try {
            const headers = new Headers();
            headers.append("auth_token", authToken);
            headers.append("Accept", 'application/json');
            headers.append("Content-Type", 'application/json');

        
            const requestOptions = {
                method: "POST",
                headers: headers,
                body: JSON.stringify(formInput),
            };
        
            await fetch(backendPath + "/add_item", requestOptions);
            setRefreshCount(refreshCount + 1)
            
        } catch (error) {
            console.error("Error adding item", error);
        }
    }
    const handleSubmit = () => {
        event?.preventDefault();
        console.log(formInput)
        addItem(formInput);
      };
      
    const handleChange = (e: any) => {
        setFormInput({
            ...formInput,     // spread the existing state
            [e.target.name]: e.target.value   // update only the field that changes
        });
    }
    
    return ( <>
        <button onClick={handleClick} className='text-2xl w-full text-center'>+</button>
        {formExpanded ? <div className="flex">
            <div className="p-4 pl-8">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label>Title
                            <input name="title" type="text" value={formInput.title}
                                onChange={handleChange} className="bg-black ml-2 mt-4 focus:border-b-2 border-b focus:outline-none focus:ring-0"/>
                        </label> <br />
                        <label>Author
                            <input name="author" type="text" value={formInput.author}
                                onChange={handleChange} className="bg-black ml-2 mt-4 focus:border-b-2 border-b focus:outline-none focus:ring-0"/>
                        </label> <br />
                        <label>Content
                            <input name="content" type="text" value={formInput.content}
                                onChange={handleChange} className="bg-black ml-2 mt-4 focus:border-b-2 border-b focus:outline-none focus:ring-0"/>
                        </label> <br />
                        <label>Summary
                            <input name="summary" type="text" value={formInput.summary}
                                onChange={handleChange} className="bg-black ml-2 mt-4 focus:border-b-2 border-b focus:outline-none focus:ring-0"/>
                        </label> <br />
                        <label>Link
                            <input name="link" type="text" value={formInput.link}
                                onChange={handleChange} className="bg-black ml-2 mt-4 focus:border-b-2 border-b focus:outline-none focus:ring-0"/>
                        </label> <br />
                        <label>Type
                            <input name="type" type="text" value={formInput.type}
                                onChange={handleChange} className="bg-black ml-2 mt-4 focus:border-b-2 border-b focus:outline-none focus:ring-0"/>
                        </label> <br />
                        <input type="submit" value="Save" className="mt-4 border hover:border-2 hover:border-primary py-1 px-3 rounded-sm text-xl bg-secondary"/>
                    </div>
                </form>
            </div>
        </div>
         : ""}
    </> );
}
 
export default NewItem;