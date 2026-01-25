const STORAGE_KEY = "morningTopics";

const datePicker = document.getElementById("datePicker");
const todayBtn = document.getElementById("todayBtn");
const goBtn = document.getElementById("goBtn");
const activeDate = document.getElementById("activeDate");
const topicForm = document.getElementById("topicForm");
const topicTitle = document.getElementById("topicTitle");
const topicList = document.getElementById("topicList");
const emptyState = document.getElementById("emptyState");

const formatDate = (date) => date.toISOString().split("T")[0];

const state = {
  selectedDate: formatDate(new Date()),
};

const loadTopics = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Kon topics niet laden", error);
    return {};
  }
};

const saveTopics = (topics) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
};

const getTopicsForDate = () => {
  const topics = loadTopics();
  return topics[state.selectedDate] || [];
};

const setTopicsForDate = (items) => {
  const topics = loadTopics();
  topics[state.selectedDate] = items;
  saveTopics(topics);
};

const updateActiveDateText = () => {
  const date = new Date(state.selectedDate);
  const formatted = date.toLocaleDateString("nl-BE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  activeDate.textContent = `Geselecteerde dag: ${formatted}`;
};

const createTopicElement = (topic) => {
  const li = document.createElement("li");
  li.className = "topic-item";

  const title = document.createElement("h3");
  title.textContent = topic.title;

  const meta = document.createElement("p");
  meta.className = "topic-meta";
  meta.textContent = "Conclusie";

  const textarea = document.createElement("textarea");
  textarea.rows = 4;
  textarea.placeholder = "Noteer hier wat er beslist werd...";
  textarea.value = topic.conclusion || "";

  textarea.addEventListener("input", (event) => {
    topic.conclusion = event.target.value;
    const topics = getTopicsForDate();
    const index = topics.findIndex((item) => item.id === topic.id);
    if (index !== -1) {
      topics[index] = { ...topic };
      setTopicsForDate(topics);
    }
  });

  li.append(title, meta, textarea);
  return li;
};

const renderTopics = () => {
  const topics = getTopicsForDate();
  topicList.innerHTML = "";

  if (topics.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }

  topics.forEach((topic) => {
    topicList.appendChild(createTopicElement(topic));
  });
};

const setSelectedDate = (value) => {
  state.selectedDate = value;
  datePicker.value = value;
  updateActiveDateText();
  renderTopics();
};

const handleAddTopic = (event) => {
  event.preventDefault();
  const title = topicTitle.value.trim();
  if (!title) {
    return;
  }
  const topics = getTopicsForDate();
  const newTopic = {
    id: crypto.randomUUID(),
    title,
    conclusion: "",
  };
  topics.unshift(newTopic);
  setTopicsForDate(topics);
  topicTitle.value = "";
  renderTopics();
};

topicForm.addEventListener("submit", handleAddTopic);

todayBtn.addEventListener("click", () => {
  setSelectedDate(formatDate(new Date()));
});

goBtn.addEventListener("click", () => {
  if (datePicker.value) {
    setSelectedDate(datePicker.value);
  }
});

setSelectedDate(state.selectedDate);
