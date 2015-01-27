package org.example.navigator;

import java.util.ArrayList;
import java.util.stream.Stream;

/**
 * Created by Dmitry.Ivanov on 1/27/2015.
 */
public final class NodeQueue {
    public ArrayList<Node> arr;
    public int size;

    public NodeQueue() {
        arr = new ArrayList<>();
    }

    public void add(Node n) {
        n.number = size;
        if (size < arr.size()) {
            arr.set(size, n);
        } else {
            arr.add(n);
        }
        size++;
        heapUp(n.number);
    }

    public Node poll() {
        if (size == 0) return null;
        Node res = arr.get(0);
        swap(0, --size);
        arr.set(size, null);
        heapDown(0);
        return res;
    }

    private void heapDown(int n) {
        int left;
        while ((left = n*2 + 1) < size) {
            int right = left + 1;
            int candidate = right >=  size || arr.get(left).heurictics < arr.get(right).heurictics ? left : right;
            if (arr.get(candidate).heurictics < arr.get(n).heurictics) {
                swap(n, candidate);
                n = candidate;
            } else break;
        }
    }

    private void swap(int n1, int n2) {

        Node s = arr.get(n1);
        arr.set(n1, arr.get(n2));
        arr.set(n2, s);

        arr.get(n1).number = n1;
        arr.get(n2).number = n2;
    }

    private int parent(int n) {
        return (n-1)/2;
    }

    public void heapUp(int n) {
        while (n != 0) {
            int p = parent(n);
            if (arr.get(n).heurictics < arr.get(p).heurictics) {
                swap(n, p);
                n = p;
            } else break;
        }
    }


    public int size() {
        return size;
    }

    public Stream<Node> stream() {
        return arr.stream().limit(size);
    }
}
