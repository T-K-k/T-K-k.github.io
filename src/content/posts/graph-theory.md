---
title: 图论基础：图的存储与遍历
published: 2026-11-16
description: 图论基础知识、邻接表、DFS 与 BFS。
tags: [算法竞赛, 图论, DFS, BFS]
category: 算法竞赛
draft: false
---

# 图论基础

## 一、图的基本概念

图（Graph）由顶点（Vertex）和边（Edge）组成。

常见类型：

- **无向图**：边没有方向。
- **有向图**：边具有方向。
- **带权图**：边具有权值。

通常用 `n` 表示顶点数，`m` 表示边数。

![无向图与有向图](/images/graph-theory/graph-types.png)

## 二、图的存储

### 1. 邻接矩阵

使用二维数组 `g[u][v]` 表示顶点之间的连接关系。

- 优点：判断一条边是否存在只需要 `O(1)`。
- 缺点：空间复杂度为 `O(n²)`，不适合顶点数量很大的稀疏图。

### 2. 邻接表

使用 `vector` 存储每个顶点直接连接的其他顶点。

```cpp
#include <iostream>
#include <vector>
using namespace std;

const int N = 100005;
vector<int> g[N];

int main() {
    int n, m;
    cin >> n >> m;

    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        g[u].push_back(v);
    }

    return 0;
}
```

以上代码存储有向图；无向图还需要添加 `g[v].push_back(u)`。

复杂度：

- 空间：`O(n + m)`
- 判断边是否存在：`O(deg(u))`
- 遍历顶点 `u` 的邻居：`O(deg(u))`

![邻接矩阵与邻接表](/images/graph-theory/graph-storage.png)

## 三、图的遍历

### 1. DFS：深度优先搜索

**核心思想：一条路走到底，再回溯寻找其他路径。**

递归实现：

```cpp
void dfs(int u) {
    vis[u] = true;
    cout << u << " ";

    for (int v : g[u]) {
        if (!vis[v])
            dfs(v);
    }
}
```

时间复杂度：`O(n + m)`。

注意：图中可能存在环，需要使用 `vis[]` 防止重复访问。

当图的深度过大时，递归可能导致栈溢出，可以改用显式栈：

```cpp
void dfs(int start) {
    stack<int> st;
    st.push(start);
    vis[start] = true;

    while (!st.empty()) {
        int u = st.top();
        st.pop();

        cout << u << " ";

        for (int v : g[u]) {
            if (!vis[v]) {
                vis[v] = true;
                st.push(v);
            }
        }
    }
}
```

注意：非递归 DFS 的访问顺序不一定与递归 DFS 相同。

### 2. BFS：广度优先搜索

**核心思想：从起点出发，按照距离逐层向外搜索。**

使用队列 `queue` 实现：

```cpp
void bfs(int start) {
    queue<int> q;
    q.push(start);
    vis[start] = true;

    while (!q.empty()) {
        int u = q.front();
        q.pop();

        cout << u << " ";

        for (int v : g[u]) {
            if (!vis[v]) {
                vis[v] = true;
                q.push(v);
            }
        }
    }
}
```

时间复杂度：`O(n + m)`。

为什么使用队列？

因为队列具有**先进先出（FIFO）**的性质，能够保证按照距离起点的边数逐层搜索。

**重要性质：** 对于无权图，BFS 首次访问某个顶点时，就找到了从起点到该顶点的最少边数。

因此，BFS 也是解决无权图最短路的经典算法。

## 四、DFS 与 BFS 对比

![DFS 与 BFS 遍历对比](/images/graph-theory/dfs-bfs.png)

| | DFS | BFS |
|---|---|---|
| 核心思想 | 优先深入 | 逐层扩展 |
| 数据结构 | 栈 / 递归 | 队列 |
| 时间复杂度 | O(n + m) | O(n + m) |
| 无权图最短路 | 不保证 | 可以求解 |

## 五、注意事项

1. 使用 `vis[]` 避免重复访问。
2. 无向图需要双向建边。
3. 非连通图需要从多个起点分别搜索。
4. 如果要求按编号顺序遍历，需要注意邻接表排序和栈的访问顺序。
