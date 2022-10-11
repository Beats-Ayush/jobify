import React from "react";
import { useAppContext } from "../context/appContext";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from "../assets/wrappers/PageBtnContainer";

const PageBtnContainer = () => {
  const { numOfPages, page, changePage } = useAppContext();

  const pages = Array.from({ length: numOfPages }, (ele, idx) => idx + 1);

  const nextPage = () => {
    let nextPage = page === numOfPages ? 1 : page + 1;
    changePage(nextPage);
  };

  const prevPage = () => {
    let prevPage = page === 1 ? numOfPages : page - 1;
    changePage(prevPage);
  };

  return (
    <Wrapper>
      <button className="prev-btn" onClick={prevPage}>
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className="btn-container">
        {pages.map((pageNum, index) => (
          <button
            type="button"
            key={index}
            className={pageNum === page ? "pageBtn active" : "pageBtn"}
            onClick={() => changePage(pageNum)}
          >
            {pageNum}
          </button>
        ))}
      </div>
      <button className="next-btn" onClick={nextPage}>
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};

export default PageBtnContainer;
