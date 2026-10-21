// Each topic becomes one card on the roadmap.
// To add a new topic later, copy one block and edit it.

const roadmap = [
    {
        id: 1,
        title: "Programming Basics & Complexity",
        level: "Beginner",
        description:
            "Learn loops, functions, recursion basics and how to measure code speed with Big-O.",
        subtopics: [
            "Time & Space Complexity",
            "Big-O, Omega, Theta",
            "Loops and Conditionals",
            "Functions and Basic Recursion",
        ],
        links: [
            { name: "GeeksforGeeks – Analysis of Algorithms", url: "https://www.geeksforgeeks.org/analysis-of-algorithms-big-o-analysis/" },
            { name: "NeetCode Roadmap", url: "https://neetcode.io/roadmap" },
        ],
    },
    {
        id: 2,
        title: "Arrays",
        level: "Beginner",
        description:
            "The most basic data structure. Master traversal, prefix sums and two pointers.",
        subtopics: [
            "Traversal & Insertion / Deletion",
            "Prefix Sum",
            "Two Pointers",
            "Kadane's Algorithm",
        ],
        links: [
            { name: "GeeksforGeeks – Arrays", url: "https://www.geeksforgeeks.org/array-data-structure/" },
            { name: "LeetCode – Array Problems", url: "https://leetcode.com/tag/array/" },
        ],
    },
    {
        id: 3,
        title: "Strings",
        level: "Beginner",
        description:
            "Work with text: palindromes, anagrams, pattern matching and string manipulation.",
        subtopics: [
            "String Manipulation",
            "Palindromes & Anagrams",
            "Sliding Window on Strings",
            "Pattern Matching (KMP basics)",
        ],
        links: [
            { name: "GeeksforGeeks – Strings", url: "https://www.geeksforgeeks.org/string-data-structure/" },
            { name: "LeetCode – String Problems", url: "https://leetcode.com/tag/string/" },
        ],
    },
    {
        id: 4,
        title: "Searching & Sorting",
        level: "Beginner",
        description:
            "Learn how to find and arrange data efficiently with classic algorithms.",
        subtopics: [
            "Linear & Binary Search",
            "Bubble, Selection, Insertion Sort",
            "Merge Sort & Quick Sort",
            "Binary Search on Answer",
        ],
        links: [
            { name: "VisuAlgo – Sorting", url: "https://visualgo.net/en/sorting" },
            { name: "LeetCode – Binary Search", url: "https://leetcode.com/tag/binary-search/" },
        ],
    },
    {
        id: 5,
        title: "Hashing",
        level: "Intermediate",
        description:
            "Use hash maps and sets to solve problems in near constant time.",
        subtopics: [
            "HashMap & HashSet",
            "Frequency Counting",
            "Two Sum Pattern",
            "Collision Handling",
        ],
        links: [
            { name: "GeeksforGeeks – Hashing", url: "https://www.geeksforgeeks.org/hashing-data-structure/" },
            { name: "LeetCode – Hash Table", url: "https://leetcode.com/tag/hash-table/" },
        ],
    },
    {
        id: 6,
        title: "Linked List",
        level: "Intermediate",
        description:
            "Understand pointers and node-based structures through linked lists.",
        subtopics: [
            "Singly & Doubly Linked List",
            "Reverse a Linked List",
            "Fast & Slow Pointers",
            "Detect and Remove Cycle",
        ],
        links: [
            { name: "GeeksforGeeks – Linked List", url: "https://www.geeksforgeeks.org/linked-list-data-structure/" },
            { name: "LeetCode – Linked List", url: "https://leetcode.com/tag/linked-list/" },
        ],
    },
    {
        id: 7,
        title: "Stack & Queue",
        level: "Intermediate",
        description:
            "LIFO and FIFO structures used in parsing, scheduling and monotonic problems.",
        subtopics: [
            "Stack Operations",
            "Queue & Deque",
            "Monotonic Stack",
            "Valid Parentheses Pattern",
        ],
        links: [
            { name: "GeeksforGeeks – Stack", url: "https://www.geeksforgeeks.org/stack-data-structure/" },
            { name: "LeetCode – Stack", url: "https://leetcode.com/tag/stack/" },
        ],
    },
    {
        id: 8,
        title: "Recursion & Backtracking",
        level: "Intermediate",
        description:
            "Break problems into smaller ones and explore all possibilities systematically.",
        subtopics: [
            "Recursion Tree",
            "Subsets & Permutations",
            "N-Queens",
            "Sudoku Solver",
        ],
        links: [
            { name: "GeeksforGeeks – Backtracking", url: "https://www.geeksforgeeks.org/backtracking-algorithms/" },
            { name: "LeetCode – Backtracking", url: "https://leetcode.com/tag/backtracking/" },
        ],
    },
    {
        id: 9,
        title: "Trees & Binary Search Trees",
        level: "Intermediate",
        description:
            "Hierarchical data: traversals, height, BST operations and common tree patterns.",
        subtopics: [
            "Inorder, Preorder, Postorder",
            "Level Order Traversal (BFS)",
            "BST Insert / Delete / Search",
            "Lowest Common Ancestor",
        ],
        links: [
            { name: "GeeksforGeeks – Binary Tree", url: "https://www.geeksforgeeks.org/binary-tree-data-structure/" },
            { name: "LeetCode – Tree", url: "https://leetcode.com/tag/tree/" },
        ],
    },
    {
        id: 10,
        title: "Heap & Priority Queue",
        level: "Advanced",
        description:
            "Efficiently get the smallest or largest element, used in top-K problems.",
        subtopics: [
            "Min Heap & Max Heap",
            "Heapify",
            "Top K Elements",
            "Merge K Sorted Lists",
        ],
        links: [
            { name: "GeeksforGeeks – Heap", url: "https://www.geeksforgeeks.org/heap-data-structure/" },
            { name: "LeetCode – Heap", url: "https://leetcode.com/tag/heap-priority-queue/" },
        ],
    },
    {
        id: 11,
        title: "Graphs",
        level: "Advanced",
        description:
            "Model networks and relationships. Learn traversals and shortest-path algorithms.",
        subtopics: [
            "BFS & DFS",
            "Topological Sort",
            "Dijkstra's Algorithm",
            "Union Find (DSU)",
        ],
        links: [
            { name: "GeeksforGeeks – Graph", url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/" },
            { name: "VisuAlgo – Graph Traversal", url: "https://visualgo.net/en/dfsbfs" },
        ],
    },
    {
        id: 12,
        title: "Dynamic Programming",
        level: "Advanced",
        description:
            "Solve complex problems by storing results of smaller subproblems.",
        subtopics: [
            "Memoization vs Tabulation",
            "0/1 Knapsack",
            "Longest Common Subsequence",
            "DP on Grids",
        ],
        links: [
            { name: "GeeksforGeeks – Dynamic Programming", url: "https://www.geeksforgeeks.org/dynamic-programming/" },
            { name: "LeetCode – Dynamic Programming", url: "https://leetcode.com/tag/dynamic-programming/" },
        ],
    },
];
// Icons (Font Awesome) for each topic id
const topicIcons = {
    1: "fa-code",
    2: "fa-table-cells",
    3: "fa-font",
    4: "fa-arrow-down-wide-short",
    5: "fa-hashtag",
    6: "fa-link",
    7: "fa-layer-group",
    8: "fa-rotate",
    9: "fa-sitemap",
    10: "fa-mountain",
    11: "fa-diagram-project",
    12: "fa-brain",
};

roadmap.forEach((t) => {
    t.icon = topicIcons[t.id] || "fa-code";
});