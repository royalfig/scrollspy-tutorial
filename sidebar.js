const aside = document.querySelector("aside");

const headings = Array.from(document.querySelectorAll("h2,h3,h4,h5,h6"));

export default function buildSidebar() {
  let id = 0;
  let datagroup = 0;
  let prev = null;
  let parent = 0;
  headings.forEach((el) => {
    observer.observe(el);
    el.id = id++;
    const tagNum = parseTag(el.tagName);
    console.log(tagNum, prev, parent);
    if (tagNum !== prev && tagNum !== 2) datagroup++;
    if (tagNum === 2) {
      datagroup++;
      parent = datagroup;
    }

    const link = template(el, tagNum, prev, datagroup, parent);
    aside.append(link);
    prev = tagNum;
  });
}

const template = (el, tagNum, prev, datagroup, parent) => {
  const a = document.createElement("a");
  a.textContent = el.textContent;
  a.href = `#${el.id}`;
  a.classList.add(
    "sidebar__link",
    el.tagName.toLowerCase(),
    `datagroup-${datagroup}`,
    `dataparent-${parent}`
  );
  a.setAttribute("data-parent", parent);
  a.setAttribute("data-group", datagroup);
  a.title = el.textContent;
  return a;
};

const parseTag = (tag) => {
  const [letter, num] = tag;
  return +num;
};

// Observer

let options = {
  // root: document.querySelector("#scrollArea"),
  // rootMargin: "0px",
  threshold: 0.5,
};

let callback = (entries, observer) => {
  let prev = null;
  entries.forEach((entry) => {
    const sidebarEl = document.querySelector(`[href='#${entry.target.id}']`);
    if (sidebarEl && entry.isIntersecting) {
      console.log({ sidebarEl, prev });
      sidebarEl.classList.add("observed");
      if (prev) prev.classList.remove("observed");
      prev = sidebarEl;
    } else {
      sidebarEl && sidebarEl.classList.remove("observed");
    }
  });
};

let observer = new IntersectionObserver(callback, options);
