import { Label } from "./label";
export declare enum FindingSeverity {
    Unknown = 0,
    Info = 1,
    Low = 2,
    Medium = 3,
    High = 4,
    Critical = 5
}
export declare enum FindingType {
    Unknown = 0,
    Exploit = 1,
    Suspicious = 2,
    Degraded = 3,
    Info = 4
}
declare type FindingInput = {
    name: string;
    description: string;
    alertId: string;
    protocol?: string;
    severity: FindingSeverity;
    type: FindingType;
    metadata?: {
        [key: string]: string;
    };
    addresses?: string[];
    labels?: Label[];
};
export declare class Finding {
    readonly name: string;
    readonly description: string;
    readonly alertId: string;
    readonly protocol: string;
    readonly severity: FindingSeverity;
    readonly type: FindingType;
    readonly metadata: {
        [key: string]: string;
    };
    readonly addresses: string[];
    readonly labels: Label[];
    private constructor();
    toString(): string;
    static from(findingInput: FindingInput): Finding;
    static fromObject({ name, description, alertId, protocol, severity, type, metadata, addresses, labels }: FindingInput): Finding;
}
export {};
