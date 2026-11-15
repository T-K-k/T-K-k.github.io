
---
title: 并查集学习笔记
published: 2026-11-15
description: 记录并查集的基本原理与 C++ 实现
tags: [C++, 并查集, 算法竞赛]
category: 算法竞赛
draft: false
---

# 并查集学习笔记

## 一、什么是并查集？

并查集（Disjoint Set Union，DSU）是一种用于维护集合的数据结构。

它主要支持两种操作：

1. 查询两个元素是否属于同一个集合。
2. 将两个集合合并。

## 二、并查集的 C++ 实现

```cpp
const int N = 100005;
int fa[N];

void init(int n) {
    for (int i = 1; i <= n; i++)
        fa[i] = i;
}

int find(int x) {
    if (fa[x] == x)
        return x;
    return fa[x] = find(fa[x]);
}

void merge(int x, int y) {
    int fx = find(x), fy = find(y);
    if (fx != fy)
        fa[fx] = fy;
}
```

## 三、学习总结

并查集的核心是利用父节点维护集合关系。

使用路径压缩可以显著提高查询效率。

后续还可以学习种类并查集，用于解决敌友关系、食物链等问题。
