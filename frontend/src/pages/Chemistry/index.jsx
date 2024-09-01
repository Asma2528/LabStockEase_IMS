import { useState } from 'react';
import BreadCrumbs from '../../components/BreadCrumbs';
import Model from './components/model.chemistry';
import { FaPlus } from 'react-icons/fa';
import { useGetAllChemistryItemsQuery } from '../../provider/queries/Chemistry.query';
import Loader from '../../components/Loader';
import ChemistryCard from './components/Card.chemistry';
import { BsArrowRightCircle, BsArrowLeftCircle } from 'react-icons/bs';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ChemistryPage = () => {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const [SearchParams] = useSearchParams();
    const [Search, setSearch] = useState(SearchParams.get("query") || '');

    const { isLoading, data, isFetching } = useGetAllChemistryItemsQuery({
        query: SearchParams.get("query") || '',
        page: SearchParams.get("page") || 1
    });

    console.log("API Request Sent");
    console.log("Loading:", isLoading);
    console.log("Data:", data);

    const onNextPageHandler = () => {
        const page = Number(SearchParams.get("page")) || 1;
        const query = SearchParams.get("query") || '';
        const nextPage = page + 1;
        const queryString = query ? `?query=${query}&page=${nextPage}` : `?page=${nextPage}`;
        navigate(`/chemistry${queryString}`);
    };

    const onPrevPageHandler = () => {
        const page = Number(SearchParams.get("page")) || 1;
        const query = SearchParams.get("query") || '';
        const prevPage = page - 1;
        const queryString = query ? `?query=${query}&page=${prevPage}` : `?page=${prevPage}`;
        navigate(`/chemistry${queryString}`);
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (!Search) return;
        navigate(`/chemistry?query=${Search}&page=1`);
    };

    return (
        <>
            <BreadCrumbs PageLink='/chemistry' PageName='Chemistry' />

            <div className="mb-3 flex justify-end w-[85%] mx-auto">
                <button
                    onClick={() => setVisible(!visible)}
                    className="px-4 rounded-md py-2 bg-blue-900 text-white inline-flex items-center gap-x-2"
                >
                    Add Item <FaPlus />
                </button>
            </div>

            <form onSubmit={onSubmitHandler} className="mb-3 flex justify-end w-[90%] mx-auto">
                <input
                    value={Search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-[90%] mx-auto lg:mx-0 lg:w-1/2 rounded-sm border py-3 px-5 outline-none"
                    placeholder="Search Item"
                />
            </form>

            <div className={`mb-3 flex ${(Number(SearchParams.get("page")) || 1) > 1 ? 'justify-between' : 'justify-end'} w-[90%] mx-auto`}>
                {(Number(SearchParams.get("page")) || 1) > 1 && (
                    <button onClick={onPrevPageHandler} title='Prev Page' className="text-black text-xl lg:text-3xl p-2">
                        <BsArrowLeftCircle />
                    </button>
                )}
                {data && data.more && (
                    <button onClick={onNextPageHandler} title='Next Page' className="text-black text-xl lg:text-3xl p-2">
                        <BsArrowRightCircle />
                    </button>
                )}
            </div>

            <div className="w-full pt-10">
                {isLoading || isFetching ? (
                    <Loader />
                ) : (
                    <div className="relative overflow-x-auto shadow">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 border-b uppercase bg-gray-50">
                                <tr className="border-b">
                                    <th scope="col" className="px-4 py-2">Item Name</th>
                                    <th scope="col" className="px-4 py-2">Company/Brand</th>
                                    <th scope="col" className="px-4 py-2">Date Added</th>
                                    <th scope="col" className="px-4 py-2">Bill No</th>
                                    <th scope="col" className="px-4 py-2">Total Quantity</th>
                                    <th scope="col" className="px-4 py-2">Current Quantity</th>
                                    <th scope="col" className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.items.length > 0 ? (
                                    data.items.map((c, i) => (
                                        <ChemistryCard key={c._id || i} id={i + 1} data={c} />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center px-4 py-2">No items found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Model visible={visible} setVisible={setVisible} />
        </>
    );
};

export default ChemistryPage;
